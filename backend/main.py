"""
Wilaya+ — backend IA Tour Algérie 2026
--------------------------------------
Deux endpoints :
  POST /api/generate-itinerary — (mood, durée, budget) -> itinéraire réel généré par Gemini.
  POST /api/copilot-chat       — chat avec Fennec, ancré dans l'itinéraire réel de l'utilisateur.

Lancer en local :
    cd backend
    pip install -r requirements.txt
    export GEMINI_API_KEY="ta_clé"
    uvicorn main:app --reload --port 8000
"""

import json
import logging
import os
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from pydantic import BaseModel, Field, ValidationError

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("wilaya")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash")

app = FastAPI(title="Wilaya+ API", version="0.1.0")

# En dev, le frontend Vite tourne sur un port différent (3000) du backend (8000).
# En prod, si tu sers tout derrière le même domaine, restreins cette liste.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_client: genai.Client | None = None


def get_client() -> genai.Client:
    global _client
    if _client is None:
        if not GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY manquante dans l'environnement.")
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


# ---------------------------------------------------------------------------
# Schéma — doit correspondre EXACTEMENT à ce que le frontend attend
# (voir client/src/lib/wilayaData.js -> MOCK_ITINERARY)
# ---------------------------------------------------------------------------

MoodId = Literal["desert", "history", "chill", "culture"]

MOOD_LABELS: dict[str, str] = {
    "desert": "Aventure du désert (dunes, étoiles, Sahara)",
    "history": "Histoire & architecture (Casbah, ruines romaines, médinas)",
    "chill": "Chill & côte (Méditerranée, calanques)",
    "culture": "Culture & artisanat (marchés, poteries, musique locale)",
}

BUDGET_LABELS: dict[int, str] = {
    1: "petit budget — on optimise chaque dinar",
    2: "budget moyen — bon équilibre",
    3: "confort — on se fait plaisir",
}


class GenerateRequest(BaseModel):
    mood: MoodId
    duration: int = Field(ge=1, le=10)
    budget: int = Field(ge=1, le=3)


class Site(BaseModel):
    id: int
    day: int
    name: str
    wilaya: str
    description: str
    duration_hours: int
    budget_level: int
    tags: list[str]
    icon: str
    tip: str
    le_fennec_tip: str | None = None
    color: str
    cover_gradient: str


class Itinerary(BaseModel):
    title: str
    total_days: int
    le_fennec_comment: str
    le_fennec_pose: str
    sites: list[Site]


# ---------------------------------------------------------------------------
# Prompt — génération d'itinéraire
# ---------------------------------------------------------------------------

SYSTEM_INSTRUCTION = """Tu es Fennec, un renard algérien sarcastique et chaleureux qui \
conçoit des itinéraires touristiques réels pour l'application Wilaya+. Tu connais les 58 \
wilayas d'Algérie, leur patrimoine (civilisation, culture, cultuel, artisanat) et tu \
donnes des conseils pratiques et honnêtes. Tu dois répondre EXCLUSIVEMENT avec un objet \
JSON valide respectant le schéma fourni — aucun texte avant ou après, aucun bloc markdown.

Règles de contenu :
- Utilise uniquement des lieux et wilayas réels d'Algérie, avec des descriptions factuellement \
plausibles (pas d'invention de monuments qui n'existent pas).
- Respecte la neutralité culturelle et religieuse et évite tout stéréotype régional, de genre \
ou d'origine (conformité Article 10 du règlement du concours).
- `sites` doit contenir exactement `total_days` éléments, un par jour, avec `day` de 1 à \
`total_days`.
- `le_fennec_tip` peut être `null` pour certains sites (Fennec ne commente pas toujours).
- `cover_gradient` est une valeur CSS `linear-gradient(135deg, #COULEUR1, #COULEUR2)` cohérente \
avec `color`.
- `icon` est un unique caractère ou symbole unicode simple (ex: ⌂, ✥, ⌁, ✦).
- Le ton de Fennec dans `le_fennec_comment` et `le_fennec_tip` est malicieux, chaleureux, jamais \
générique."""


def build_prompt(req: GenerateRequest) -> str:
    return f"""Génère un itinéraire touristique en Algérie avec ces contraintes :
- Ambiance recherchée : {MOOD_LABELS[req.mood]}
- Durée : {req.duration} jour(s)
- Niveau de budget : {BUDGET_LABELS[req.budget]} (niveau {req.budget}/3)

Renvoie un unique objet JSON avec cette structure exacte :
{{
  "title": string (titre poétique et court de l'itinéraire, en français),
  "total_days": {req.duration},
  "le_fennec_comment": string (verdict de Fennec sur l'itinéraire, 1-2 phrases, ton malicieux),
  "le_fennec_pose": "proud" | "hype" | "skeptic" | "thinking",
  "sites": [
    {{
      "id": number,
      "day": number,
      "name": string (nom du lieu/ville),
      "wilaya": string,
      "description": string (1-2 phrases),
      "duration_hours": number,
      "budget_level": {req.budget},
      "tags": [string, string] (2 tags courts, ex: "culture", "nature"),
      "icon": string (un seul caractère/symbole),
      "tip": string (conseil pratique concret),
      "le_fennec_tip": string | null (remarque sarcastique de Fennec, peut être null),
      "color": string (couleur hex, ex: "#8f3e2c"),
      "cover_gradient": string (ex: "linear-gradient(135deg, #8f3e2c, #d7963a)")
    }}
  ]
}}"""


# ---------------------------------------------------------------------------
# Fallback — si Gemini échoue, on ne casse jamais la démo
# ---------------------------------------------------------------------------

FALLBACK_ITINERARY = Itinerary(
    title="Trésors d'artisanat & terroirs",
    total_days=3,
    le_fennec_comment="Tu vas repartir avec les valises pleines de tapis et d'épices. Prépare ton coffre.",
    le_fennec_pose="proud",
    sites=[
        Site(
            id=1, day=1, name="Ghardaïa & vallée du M'Zab", wilaya="Ghardaïa",
            description="Cités pentapoles millénaires, architecture d'avant-garde et tissage de tapis légendaire.",
            duration_hours=7, budget_level=1, tags=["culture", "architecture"],
            icon="⌂", tip="Respecte les consignes de visite et les tenues traditionnelles.",
            le_fennec_tip="Le partage des eaux ici a 1000 ans. Même ton smartphone est jaloux.",
            color="#8f3e2c", cover_gradient="linear-gradient(135deg, #8f3e2c, #d7963a)",
        ),
        Site(
            id=2, day=2, name="Tlemcen, cité des princes", wilaya="Tlemcen",
            description="Palais El Mechouar, mosquée almohade, cascades d'El Ourit et broderies de Chedda.",
            duration_hours=6, budget_level=1, tags=["culture", "histoire"],
            icon="✥", tip="Visite les ateliers de poterie et les tisserands traditionnels de Mansourah.",
            le_fennec_tip=None, color="#145b43", cover_gradient="linear-gradient(135deg, #145b43, #4e9b80)",
        ),
        Site(
            id=3, day=3, name="Constantine, ville des ponts", wilaya="Constantine",
            description="Gorges du Rhummel vertigineuses et musique Malouf envoûtante.",
            duration_hours=7, budget_level=1, tags=["culture", "patrimoine"],
            icon="⌁", tip="Traverse la passerelle au coucher du soleil.",
            le_fennec_tip="Si t'as le vertige, ferme les yeux et tiens mon sac.",
            color="#2f2131", cover_gradient="linear-gradient(135deg, #2f2131, #b85631)",
        ),
    ],
)


def fallback_for(req: GenerateRequest) -> Itinerary:
    """Adapte le fallback statique à la durée demandée, comme le faisait le mock JS."""
    base = FALLBACK_ITINERARY.model_copy(deep=True)
    base.total_days = req.duration
    template = base.sites
    sites = [template[i % len(template)].model_copy(deep=True) for i in range(req.duration)]
    for i, site in enumerate(sites):
        site.id = i + 1
        site.day = i + 1
        site.budget_level = req.budget
    base.sites = sites
    return base


# ---------------------------------------------------------------------------
# Endpoint — génération d'itinéraire
# ---------------------------------------------------------------------------


@app.post("/api/generate-itinerary", response_model=Itinerary)
def generate_itinerary(req: GenerateRequest) -> Itinerary:
    try:
        client = get_client()
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=build_prompt(req),
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                response_mime_type="application/json",
                response_schema=Itinerary,
                temperature=0.9,
                # Gemini 3.x : "medium" suffit largement pour une extraction JSON
                # structurée comme celle-ci, et coûte moins cher / répond plus vite
                # que "high" (utile en démo live devant le jury).
                thinking_config=types.ThinkingConfig(thinking_level="medium"),
            ),
        )
        raw = response.text
        data = json.loads(raw)
        itinerary = Itinerary.model_validate(data)
        logger.info("Itinéraire généré par Gemini pour mood=%s duration=%s budget=%s", req.mood, req.duration, req.budget)
        return itinerary

    except (RuntimeError, json.JSONDecodeError, ValidationError) as exc:
        # RuntimeError -> pas de clé API configurée
        # JSONDecodeError -> Gemini n'a pas renvoyé de JSON exploitable
        # ValidationError -> le JSON ne respecte pas le schéma attendu
        raw_preview = locals().get("raw", "")[:1500]
        logger.warning("Gemini indisponible ou réponse invalide (%s), fallback utilisé.\n--- Réponse brute (tronquée) ---\n%s", exc, raw_preview)
        return fallback_for(req)

    except Exception as exc:  # sécurité : ne jamais planter la démo devant le jury
        logger.exception("Erreur inattendue lors de la génération, fallback utilisé.")
        return fallback_for(req)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "gemini_configured": bool(GEMINI_API_KEY)}


# ---------------------------------------------------------------------------
# Copilot chat — Fennec répond, ancré dans l'itinéraire réel de l'utilisateur
# ---------------------------------------------------------------------------

# On rejoue l'historique complet à chaque appel (pas de session côté serveur) :
# plus simple, sans état, et suffisant pour une démo — cohérent avec l'esprit
# du reste du backend qui ne garde rien en mémoire entre les requêtes.
class ChatMessage(BaseModel):
    sender: Literal["user", "bot"]
    text: str


class ChatSiteContext(BaseModel):
    day: int
    name: str
    wilaya: str
    description: str


class ChatItineraryContext(BaseModel):
    title: str
    total_days: int
    sites: list[ChatSiteContext]


class CopilotChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = Field(default_factory=list)
    mood: MoodId | None = None
    duration: int | None = None
    budget: int | None = None
    itinerary: ChatItineraryContext | None = None


class CopilotChatResponse(BaseModel):
    reply: str


COPILOT_SYSTEM_INSTRUCTION = """Tu es Fennec, le copilote conversationnel de l'application \
Wilaya+, une app de voyage algérienne. Tu es sarcastique, chaleureux, jamais générique — et \
surtout honnête : si tu ne sais pas quelque chose, dis-le plutôt que d'inventer.

Règles :
- Réponds en français, en 1 à 4 phrases maximum. Ce n'est pas un essai, c'est une conversation.
- Si un itinéraire de l'utilisateur t'est fourni dans le contexte, ancre TOUJOURS ta réponse \
dedans en priorité (les vrais noms de lieux, les vrais jours) plutôt que de parler en général.
- Si aucun itinéraire n'est fourni et que la question en dépend ("pourquoi as-tu choisi X"), \
dis clairement à l'utilisateur qu'il n'a pas encore généré d'itinéraire, et invite-le à le \
faire d'abord.
- Respecte la neutralité culturelle et religieuse et évite tout stéréotype régional, de genre \
ou d'origine (conformité Article 10 du règlement du concours IA Tour Algérie 2026).
- Ne réponds JAMAIS en JSON ou en markdown : texte brut, ton naturel, comme à l'oral."""


def build_copilot_contents(req: CopilotChatRequest) -> str:
    context_lines: list[str] = []

    if req.itinerary:
        sites_desc = "\n".join(
            f"  Jour {site.day} — {site.name} ({site.wilaya}) : {site.description}"
            for site in req.itinerary.sites
        )
        context_lines.append(
            f"Itinéraire actuel de l'utilisateur : « {req.itinerary.title} » "
            f"({req.itinerary.total_days} jour(s))\n{sites_desc}"
        )
    else:
        context_lines.append("L'utilisateur n'a pas encore généré d'itinéraire.")

    if req.mood:
        context_lines.append(f"Ambiance sélectionnée : {MOOD_LABELS.get(req.mood, req.mood)}")
    if req.duration:
        context_lines.append(f"Durée sélectionnée : {req.duration} jour(s)")
    if req.budget:
        context_lines.append(f"Budget sélectionné : {BUDGET_LABELS.get(req.budget, req.budget)}")

    history_lines = "\n".join(
        f"{'Utilisateur' if m.sender == 'user' else 'Fennec'} : {m.text}" for m in req.history[-8:]
    )

    return f"""Contexte :
{chr(10).join(context_lines)}

Historique récent de la conversation :
{history_lines if history_lines else "(aucun message précédent)"}

Nouveau message de l'utilisateur : {req.message}

Réponds en tant que Fennec, directement, sans préambule."""


FALLBACK_COPILOT_REPLY = (
    "Je suis un peu déconnecté du désert en ce moment (mon lien avec l'IA a coupé) — "
    "réessaie dans un instant, ou pose ta question autrement."
)


@app.post("/api/copilot-chat", response_model=CopilotChatResponse)
def copilot_chat(req: CopilotChatRequest) -> CopilotChatResponse:
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message vide.")

    try:
        client = get_client()
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=build_copilot_contents(req),
            config=types.GenerateContentConfig(
                system_instruction=COPILOT_SYSTEM_INSTRUCTION,
                temperature=0.8,
                # Pas de thinking_config ici : une réponse courte (1-4 phrases),
                # ancrée dans un contexte déjà construit dans le prompt, n'a pas
                # besoin de raisonnement multi-étapes. Le thinking partageait le
                # budget de tokens avec la réponse visible et provoquait des
                # troncatures (voir logs "MAX_TOKENS" avant ce correctif).
                max_output_tokens=300,
            ),
        )
        reply = (response.text or "").strip()

        finish_reason = response.candidates[0].finish_reason if response.candidates else None
        if finish_reason == "MAX_TOKENS":
            logger.warning("Copilot chat tronqué (MAX_TOKENS) pour message=%r", req.message)

        if not reply:
            raise ValueError("Réponse vide de Gemini.")
        logger.info("Copilot chat répondu (mood=%s, itinéraire=%s)", req.mood, bool(req.itinerary))
        return CopilotChatResponse(reply=reply)

    except RuntimeError as exc:
        logger.warning("Copilot chat : clé Gemini manquante (%s), fallback utilisé.", exc)
        return CopilotChatResponse(reply=FALLBACK_COPILOT_REPLY)

    except Exception:  # sécurité : ne jamais planter la démo devant le jury
        logger.exception("Erreur inattendue dans le copilot chat, fallback utilisé.")
        return CopilotChatResponse(reply=FALLBACK_COPILOT_REPLY)