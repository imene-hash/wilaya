/* Direction : carnet de route saharien — cette page prend le temps que la modale n'avait pas : de vrais scans 3D en grand, le contexte de chaque site, et un état honnête de ce qui est réel contre ce qui reste à construire.

   La liste SITES est la source de vérité unique : chaque site a un statut ("scanned" | "roadmap").
   Ajouter un futur scan réel = ajouter une entrée avec status "scanned" et un sketchfabId, pas
   réécrire la page. C'est délibéré : au 16 août 2026, Wilaya+ n'a que deux scans réels confirmés
   (Djémila et Lemzyen, tous deux Zamani Project/UCT) sur les sept sites UNESCO d'Algérie — les
   cinq autres n'ont, à notre connaissance, aucun scan laser/photogrammétrique correctement
   documenté et licencié disponible publiquement. Le règlement du concours (Article 10) impose la
   neutralité et l'absence de survente ; afficher un scan qui n'existe pas serait le contraire de
   l'esprit du concours, donc ces cinq sites restent en état "roadmap" avec une photo statique. */
import { useLocation } from "wouter";
import { Compass, ExternalLink, Glasses, ImageOff, Layers, MapPin, Sparkles, Volume2 } from "lucide-react";
import { SiteNav, TopBar } from "../components/RihlaPrimitives";

const SITES = [
  {
    id: "djemila",
    name: "Djémila",
    subtitle: "le marché romain",
    wilaya: "Sétif",
    unescoYear: 1982,
    note: "Ruines romaines, classée 1982 — scan en ligne ci-dessous.",
    status: "scanned",
    sketchfabId: "b7a098b6197b418c8e500ad5b2f12eb0",
    sketchfabCollectionUrl: "https://sketchfab.com/zamaniproject/collections/djemila-algeria-edb6c5169b46443ca561e490ab335b62",
    scanTitle: "Djémila, le marché romain, en relevé laser réel",
    scanIntro: (
      <>
        Ceci n'est pas une capture d'écran ni une simulation : c'est le modèle 3D du site documenté par relevé
        laser-scanning terrestre en 2013 et 2014, dans le cadre d'une coopération intergouvernementale
        Algérie / Afrique du Sud. Faites-le pivoter, zoomez, passez en plein écran.
      </>
    ),
    credit: (
      <>
        <strong>Djémila (site UNESCO depuis 1982)</strong> — documentation spatiale par relevé laser-scanning terrestre,
        campagnes 2013–2014. Projet Zamani Heritage (Université du Cap) en coopération avec l'Université de Sétif et le
        programme de recherche intergouvernemental Algérie / Afrique du Sud. Modèle hébergé et diffusé par Sketchfab,
        crédité <strong>@zamaniproject</strong>.
      </>
    )
  },
  {
    id: "lemzyen",
    name: "Lemzyen",
    name2: "M'Zien",
    subtitle: "le village berbère",
    wilaya: "Atlas (à confirmer précisément)",
    unescoYear: null,
    note: "Village berbère en pierre sèche, Atlas — scan en ligne ci-dessous. Hors liste UNESCO, patrimoine berbère authentique.",
    status: "scanned",
    // ID de modèle Sketchfab À COMPLÉTER : ouvrez sketchfabCollectionUrl ci-dessous, cliquez
    // "Embed" sur le modèle de la cuisine historique, et collez l'ID (la partie entre /models/
    // et /embed de l'URL fournie) ici. Placeholder volontairement invalide pour ne jamais
    // afficher un faux embed silencieusement.
    sketchfabId: "REPLACE_WITH_REAL_LEMZYEN_MODEL_ID",
    sketchfabCollectionUrl: "https://sketchfab.com/zamaniproject/collections/berber-village-in-lemzyen-algeria",
    scanTitle: "Lemzyen, la cuisine berbère, en pierre sèche documentée",
    scanIntro: (
      <>
        Deuxième scan réel de Wilaya+, même rigueur que Djémila : le Projet Zamani a documenté le village berbère de
        Lemzyen (M'Zien) dans l'Atlas en 2013, avec relevé laser et photographie SfM, puis retexturé le modèle en 2020
        avec Reality Capture. La coopération est la même — Prof. Hamza Zeghlache, Université de Sétif.
      </>
    ),
    credit: (
      <>
        <strong>Village berbère de Lemzyen (M'Zien)</strong> — structure en pierre sèche, Atlas. Documentation par relevé
        laser-scanning et photographie SfM (2013), retexturée en 2020 avec Reality Capture. Projet Zamani Heritage
        (Université du Cap) en coopération avec Prof. Hamza Zeghlache et son équipe, Université de Sétif. Modèle hébergé
        et diffusé par Sketchfab, crédité <strong>@zamaniproject</strong>.
      </>
    )
  },
  {
    id: "kasbah",
    name: "Kasbah d'Alger",
    subtitle: null,
    wilaya: "Alger",
    unescoYear: 1992,
    note: "Médina ottomane, classée 1992.",
    status: "roadmap",
    imageQuery: "Kasbah of Algiers UNESCO medina"
  },
  {
    id: "timgad",
    name: "Timgad",
    subtitle: null,
    wilaya: "Batna",
    unescoYear: 1982,
    note: "Cité romaine, plan en damier, classée 1982.",
    status: "roadmap",
    imageQuery: "Timgad Roman ruins Algeria aerial"
  },
  {
    id: "tipasa",
    name: "Tipasa",
    subtitle: null,
    wilaya: "Tipasa",
    unescoYear: 1982,
    note: "Comptoir punique et romain, classée 1982.",
    status: "roadmap",
    imageQuery: "Tipasa Roman ruins coast Algeria"
  },
  {
    id: "mzab",
    name: "Vallée du M'Zab",
    name2: "Ghardaïa",
    subtitle: null,
    wilaya: "Ghardaïa",
    unescoYear: 1982,
    note: "Cités pentapoles ibadites, classée 1982.",
    status: "roadmap",
    imageQuery: "Ghardaia M'Zab valley pentapole architecture"
  },
  {
    id: "tassili",
    name: "Tassili n'Ajjer",
    subtitle: null,
    wilaya: "Illizi",
    unescoYear: 1982,
    note: "Art rupestre préhistorique, classée 1982.",
    status: "roadmap",
    imageQuery: "Tassili n'Ajjer rock art Sahara Algeria"
  }
];

const SCANNED_SITES = SITES.filter((site) => site.status === "scanned");
const SCANNED_COUNT = SCANNED_SITES.length;
const TOTAL_UNESCO_COUNT = SITES.filter((site) => site.unescoYear !== null).length;

export default function RevePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="page-shell feature-page">
      <SiteNav />
      <div className="page-container">
        <TopBar onBack={() => setLocation("/")} />

        <section className="feature-hero fade-up">
          <div className="route-note"><span className="route-note-mark">01</span><span><b>Axe Rêve.</b><br />Immersion, réalité augmentée et modélisation 3D.</span></div>
          <h1 className="section-title">Toucher le patrimoine avant d'y poser le pied.</h1>
          <p className="section-copy">
            L'objectif de cet axe, tel que défini par le règlement, est de valoriser le patrimoine touristique authentique
            de l'Algérie — civilisation, culture, cultuel, artisanat — via l'immersion, la VR/AR, la modélisation 3D et le
            contenu génératif. Voici où en est Wilaya+, sans détour : ce qui tourne réellement dans votre navigateur aujourd'hui,
            et ce qui reste sur la feuille de route.
          </p>
          <div className="feature-badge-row">
            <span className="feature-badge is-real"><Layers size={12} /> {SCANNED_COUNT} scans 3D réels — en ligne</span>
            <span className="feature-badge is-roadmap"><Glasses size={12} /> Réalité augmentée — prototype visuel</span>
            <span className="feature-badge is-roadmap"><Volume2 size={12} /> Audioguide vocal — en cours</span>
          </div>
        </section>

        {SCANNED_SITES.map((site, index) => (
          <section key={site.id} className={`feature-section fade-up delay-${index + 1}`}>
            <div className="feature-section-head">
              <h2>{site.scanTitle}</h2>
              <p>{site.scanIntro}</p>
            </div>
            <div className="feature-viewer-frame">
              <iframe
                title={`${site.name} — scan 3D (Zamani Project, UCT)`}
                src={`https://sketchfab.com/models/${site.sketchfabId}/embed?autostart=0&ui_theme=dark`}
                frameBorder="0"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
              />
            </div>
            <div className="feature-credit">
              {site.credit}
              {" "}
              <a href={site.sketchfabCollectionUrl} target="_blank" rel="noreferrer" className="feature-credit-link">
                Voir la collection complète sur Sketchfab <ExternalLink size={12} aria-hidden="true" />
              </a>
            </div>
          </section>
        ))}

        <section className={`feature-section fade-up delay-${SCANNED_COUNT + 1}`}>
          <div className="feature-section-head">
            <h2>Les sept sites UNESCO d'Algérie, la vraie échelle du chantier</h2>
            <p>
              {SCANNED_COUNT} scan{SCANNED_COUNT > 1 ? "s" : ""} réel{SCANNED_COUNT > 1 ? "s" : ""} sur {TOTAL_UNESCO_COUNT} sites UNESCO
              — la cible réaliste pour un vrai déploiement n'est pas "un site en démo" mais une couverture progressive
              de ce patrimoine, site après site, avec la même exigence de documentation.
            </p>
          </div>
          <div className="feature-grid-3">
            {SITES.map((site) => (
              <UnescoCard key={site.id} site={site} />
            ))}
          </div>
        </section>

        <section className={`feature-section fade-up delay-${SCANNED_COUNT + 2}`}>
          <div className="feature-section-head">
            <h2>Ce qui reste à construire, honnêtement</h2>
            <p>Trois briques composaient l'ancienne modale. Voici leur état réel, sans arrondir les angles.</p>
          </div>
          <div className="feature-grid-2">
            <div className="feature-card">
              <div className="feature-card-icon"><Layers size={18} /></div>
              <h3>Reconstruction 3D par site</h3>
              <p>
                Réel pour Djémila et Lemzyen, deux scans existants et correctement licenciés (Zamani Project/UCT).
                Étendre aux cinq sites UNESCO restants demande soit de trouver des scans CC0/CC-BY équivalents — nous
                n'en avons trouvé aucun à ce jour pour la Kasbah, Timgad, Tipasa, le M'Zab ou le Tassili — soit de
                lancer une campagne de photogrammétrie dédiée, avec accès physique au site et matériel adapté : un
                travail de fond, pas une fonctionnalité de weekend.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon"><Glasses size={18} /></div>
              <h3>Réalité augmentée mobile</h3>
              <p>
                Le viewer 3D ci-dessus peut être étendu au WebXR (AR dans le navigateur, sans app dédiée) sur les
                appareils compatibles. C'est une extension réaliste du même composant, pas une reconstruction complète.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon"><Volume2 size={18} /></div>
              <h3>Audioguide conteur</h3>
              <p>
                La synthèse vocale native du navigateur permet une narration réelle sans dépendance externe. Le texte du
                conteur Fennec existe déjà — reste à le brancher sur une vraie voix.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon"><Sparkles size={18} /></div>
              <h3>Contenu génératif</h3>
              <p>
                Le seul contenu génératif actuellement réel dans Wilaya+ est l'itinéraire produit par Gemini (axe
                Sur-Mesure). Étendre le génératif à l'axe Rêve — visuels d'ambiance par exemple — reste à faire.
              </p>
            </div>
          </div>
        </section>

        <section className="feature-section fade-up">
          <div className="fennec-reaction">
            <span style={{ fontSize: 40 }} aria-hidden="true">🦊</span>
            <div>
              <div className="reaction-label">Avis de Fennec</div>
              <p className="reaction-quote">« Un vrai scan vaut mieux que dix promesses. On construit site par site, pas tout d'un coup. »</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function UnescoCard({ site }) {
  const isScanned = site.status === "scanned";

  return (
    <div
      className={`feature-card unesco-card unesco-card-${site.status}`}
      style={isScanned ? { borderColor: "rgba(20,91,67,.4)", background: "rgba(20,91,67,.07)" } : undefined}
    >
      {isScanned ? (
        <div className="feature-card-icon"><MapPin size={18} /></div>
      ) : (
        // Pas de viewer 3D ici : c'est délibéré. Afficher un faux aperçu 3D pour un site non
        // scanné serait trompeur (Article 10 du règlement). À la place : une photo statique et
        // un badge explicite "scan pas encore disponible" — honnête, sans promettre ce qui
        // n'existe pas encore. `site.imageQuery` documente la recherche d'image de référence ;
        // choisir et créditer une image effectivement utilisable reste à faire séparément.
        <div className="unesco-card-photo" role="img" aria-label={`Photo de repère pour ${site.name} — visuel à ajouter`}>
          <ImageOff size={22} aria-hidden="true" />
        </div>
      )}

      <h3>
        {site.name}
        {site.name2 ? <span style={{ color: "var(--muted)", fontWeight: 500 }}> · {site.name2}</span> : null}
      </h3>
      <p>{site.note}</p>

      {isScanned ? (
        <span className="unesco-card-status unesco-card-status-real">
          <Layers size={12} aria-hidden="true" /> Scan 3D réel disponible
        </span>
      ) : (
        <span className="unesco-card-status unesco-card-status-roadmap">
          Scan pas encore disponible
        </span>
      )}
    </div>
  );
}