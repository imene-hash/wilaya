/* Direction : carnet de route saharien — le chat n'emprunte plus les codes d'un widget SaaS.
   Fennec répond dans des notes de carnet, pas des bulles génériques ; le "typing" est un
   tracé de route qui se dessine, écho du fil de route utilisé ailleurs dans l'app. */
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Send, X } from "lucide-react";
import { ASSETS } from "../lib/wilayaData";
import { API_BASE_URL } from "../const";
import "../copilot-modal.css";

const INITIAL_MESSAGES = [
  {
    sender: "bot",
    text: "Wesh ! Je suis Fennec, ton copilote. Dis-moi ce qui te fait vibrer en Algérie — ex : « je veux voir le désert en mode slow travel » ou « un week-end historique à Alger » — et je t'affine la route."
  }
];

const PRESET_PROMPTS = [
  "Pourquoi Timimoun pour mon ambiance ?",
  "Comment vous protégez le Tassili ?",
  "Budget moyen pour 7 jours dans le Grand Sud ?"
];

// Le backend (ChatItineraryContext / ChatSiteContext dans main.py) attend un
// sous-ensemble précis des champs de l'itinéraire — pas l'objet complet tel
// que produit par generate-itinerary (id, tags, icon, couleurs, etc. en trop
// feraient échouer la validation Pydantic côté serveur).
function toChatItineraryContext(itinerary) {
  if (!itinerary) return undefined;
  return {
    title: itinerary.title,
    total_days: itinerary.total_days,
    sites: (itinerary.sites || []).map((site) => ({
      day: site.day,
      name: site.name,
      wilaya: site.wilaya,
      description: site.description
    }))
  };
}

export default function CopilotModal({ isOpen, onClose, itinerary, mood, duration, budget }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const presetsRef = useRef(null);

  // Verrouille le scroll de la page derrière la modale tant qu'elle est ouverte.
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    const prev = { position: style.position, top: style.top, width: style.width, overflow: style.overflow };
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    style.overflow = "hidden";
    return () => {
      style.position = prev.position;
      style.top = prev.top;
      style.width = prev.width;
      style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    // On capture l'historique AVANT d'ajouter le nouveau message utilisateur :
    // c'est ce que Fennec a déjà "vu" jusqu'ici, le nouveau message part à part
    // dans le champ `message` (même contrat que CopilotChatRequest côté FastAPI).
    const historyForRequest = messages.map(({ sender, text: msgText }) => ({ sender, text: msgText }));

    setMessages((current) => [...current, { sender: "user", text }]);
    setInputVal("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/copilot-chat`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyForRequest,
          mood,
          duration,
          budget,
          itinerary: toChatItineraryContext(itinerary)
        })
      });

      if (!response.ok) {
        throw new Error(`Réponse ${response.status} du serveur`);
      }

      const data = await response.json();
      setMessages((current) => [...current, { sender: "bot", text: data.reply }]);
    } catch (error) {
      // Le backend a déjà son propre garde-fou (FALLBACK_COPILOT_REPLY) pour les
      // pannes Gemini ; celui-ci ne couvre que la panne AVANT le backend — API
      // injoignable, coupure réseau, proxy Vite mal branché en dev, etc.
      console.error("copilot-chat indisponible :", error);
      setMessages((current) => [
        ...current,
        {
          sender: "bot",
          text: "Je n'arrive pas à joindre le serveur là, tout de suite. Vérifie que le backend tourne et réessaie."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const scrollPresets = (direction) => {
    presetsRef.current?.scrollBy({ left: direction * 220, behavior: "smooth" });
  };

  return (
    <div className="copilot-overlay" onClick={onClose}>
      <div className="copilot-shell" onClick={(event) => event.stopPropagation()}>
        {/* En-tête : Fennec en photo, pas un avatar générique */}
        <header className="copilot-head">
          <div className="copilot-head-id">
            <img className="copilot-head-avatar" src={ASSETS.thinking} alt="Fennec" />
            <div>
              <h3>Fennec, ton copilote</h3>
              <p>Explique pourquoi il choisit chaque étape</p>
            </div>
          </div>
          <button type="button" className="copilot-close" onClick={onClose} aria-label="Fermer">
            <X size={17} />
          </button>
        </header>

        {/* Fil de conversation, sur fond papier — pas de bulles pleines partout */}
        <div className="copilot-thread" ref={scrollRef}>
          {messages.map((message, index) => (
            <div key={index} className={`copilot-row copilot-row-${message.sender}`}>
              {message.sender === "bot" && (
                <img className="copilot-row-avatar" src={ASSETS.thinking} alt="" aria-hidden="true" />
              )}
              <div className={`copilot-note copilot-note-${message.sender}`}>
                <p>{message.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="copilot-row copilot-row-bot">
              <img className="copilot-row-avatar" src={ASSETS.thinking} alt="" aria-hidden="true" />
              <div className="copilot-trace" aria-label="Fennec réfléchit">
                <svg viewBox="0 0 84 20" className="copilot-trace-svg" aria-hidden="true">
                  <path d="M4 14 Q 16 4, 28 14 T 52 14 T 76 14" />
                </svg>
                <span>Fennec trace la route…</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions : chips discrètes, pas des boutons pleine couleur qui écrasent le fil */}
        <div className="copilot-presets">
          <div className="copilot-presets-head">
            <span>Questions rapides</span>
            <div className="copilot-presets-nav" aria-label="Parcourir les questions rapides">
              <button type="button" onClick={() => scrollPresets(-1)} aria-label="Questions précédentes">
                <ChevronLeft size={15} />
              </button>
              <button type="button" onClick={() => scrollPresets(1)} aria-label="Questions suivantes">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
          <div className="copilot-presets-rail" ref={presetsRef}>
            {PRESET_PROMPTS.map((prompt) => (
              <button key={prompt} type="button" className="copilot-preset" onClick={() => handleSend(prompt)}>
                {prompt}
                <ChevronRight className="copilot-preset-arrow" size={14} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        {/* Saisie */}
        <form
          className="copilot-input-row"
          onSubmit={(event) => { event.preventDefault(); handleSend(); }}
        >
          <input
            type="text"
            value={inputVal}
            onChange={(event) => setInputVal(event.target.value)}
            placeholder="Écris à Fennec…"
            className="copilot-input"
            aria-label="Ton message à Fennec"
          />
          <button type="submit" className="copilot-send" aria-label="Envoyer" disabled={!inputVal.trim()}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
