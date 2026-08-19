/* Direction : carnet de route saharien — la carte qui respire, pas un screenshot de Mapbox.
   IMPORTANT (honnêteté) : "Carte Vivante & Flux" n'est pas un axe numéroté du règlement
   (Article 2 : Rêve / Sur-Mesure / Performance) — c'est une fonctionnalité produit Wilaya+.
   Présentée comme telle, jamais comme un axe officiel.

   La carte est une STYLISATION, pas une projection géographique réelle : la bande saharienne
   vide est volontairement compressée pour donner de la lisibilité aux wilayas du nord, là où
   sont concentrées les 15 wilayas documentées avec photo. Les positions relatives (est/ouest,
   nord/sud) restent fidèles à la géographie réelle — vérifiées via recherche avant construction,
   notamment la position d'Illizi (extrême sud-est, proche de la Libye, au nord du Tassili), qui
   aurait été l'erreur la plus visible pour un jury algérien si mal placée. Coordonnées sources :
   OpenStreetMap (Ghardaïa, exact), carte-algerie.com (Alger, exact ; Adrar, approximatif),
   Wikipédia/site gouvernemental wilaya d'Illizi (position relative confirmée). Le badge
   "carte stylisée" reste visible en permanence — même principe de non-survente que RevePage.

   Les "flux" affichés sont illustratifs (voir PerformancePage.jsx pour la même déclaration) :
   ils démontrent la CAPACITÉ du produit à visualiser un flux temporel, pas un flux mesuré. */
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Info, MapPin, Moon, Pause, Play, Sun } from "lucide-react";
import { SiteNav, TopBar } from "../components/RihlaPrimitives";
import { photoForWilaya } from "../lib/wilayaPhotos";

/* Coordonnées stylisées (viewBox 0 0 640 640), dérivées par projection non-linéaire de
   coordonnées lat/long réelles approximatives — voir commentaire d'en-tête. */
const NODES = [
  { id: "alger", name: "Alger", x: 314, y: 77, region: "Casbah, capitale" },
  { id: "oran", name: "Oran", x: 137, y: 145, region: "El Bahia, côte ouest" },
  { id: "tipasa", name: "Tipasa", x: 287, y: 87, region: "Ruines puniques" },
  { id: "setif", name: "Sétif", x: 431, y: 113, region: "Djémila" },
  { id: "batna", name: "Batna", x: 468, y: 155, region: "Timgad" },
  { id: "illizi", name: "Illizi", x: 580, y: 452, region: "Tassili n'Ajjer" },
  { id: "ghardaia", name: "Ghardaïa", x: 347, y: 357, region: "Vallée du M'Zab" },
  { id: "adrar", name: "Adrar", x: 154, y: 452, region: "Timimoun" },
  { id: "bechar", name: "Béchar", x: 60, y: 340, region: "Béni Abbès" },
];

/* Routes illustratives entre wilayas, pondérées par saison (0=hiver profond … 3=été).
   weight ∈ [0,1] pilote l'opacité et la vitesse du pointillé animé sur cette route pour
   la saison donnée. Logique : le littoral s'illumine en été, le Sahara profond s'illumine
   en hiver — cohérent avec les hypothèses déjà déclarées dans PerformancePage.jsx. */
const SEASONS = [
  { id: "hiver", label: "Hiver", icon: Moon, months: "Déc.–Fév." },
  { id: "printemps", label: "Printemps", icon: Sun, months: "Mars–Mai" },
  { id: "ete", label: "Été", icon: Sun, months: "Juin–Août" },
  { id: "automne", label: "Automne", icon: Moon, months: "Sept.–Nov." },
];

const ROUTES = [
  { from: "alger", to: "tipasa", weight: [0.35, 0.55, 0.95, 0.5] },
  { from: "alger", to: "setif", weight: [0.3, 0.45, 0.65, 0.5] },
  { from: "setif", to: "batna", weight: [0.35, 0.4, 0.55, 0.45] },
  { from: "oran", to: "alger", weight: [0.3, 0.5, 0.85, 0.45] },
  { from: "batna", to: "ghardaia", weight: [0.3, 0.45, 0.35, 0.5] },
  { from: "ghardaia", to: "adrar", weight: [0.55, 0.4, 0.15, 0.5] },
  { from: "adrar", to: "bechar", weight: [0.5, 0.4, 0.15, 0.45] },
  { from: "ghardaia", to: "illizi", weight: [0.6, 0.45, 0.15, 0.55] },
  { from: "alger", to: "ghardaia", weight: [0.35, 0.45, 0.3, 0.5] },
];

function nodeById(id) {
  return NODES.find((n) => n.id === id);
}

export default function CarteVivantePage() {
  const [, setLocation] = useLocation();
  const [seasonIndex, setSeasonIndex] = useState(2);
  const [playing, setPlaying] = useState(true);
  const [activeNode, setActiveNode] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!playing) return undefined;
    intervalRef.current = window.setInterval(() => {
      setSeasonIndex((prev) => (prev + 1) % SEASONS.length);
    }, 3600);
    return () => window.clearInterval(intervalRef.current);
  }, [playing]);

  const season = SEASONS[seasonIndex];
  const photo = activeNode ? photoForWilaya(activeNode.name) : null;

  const busiestRoute = useMemo(() => {
    return ROUTES.reduce((best, route) => (route.weight[seasonIndex] > best.weight[seasonIndex] ? route : best), ROUTES[0]);
  }, [seasonIndex]);

  return (
    <div className="page-shell carte-page">
      <SiteNav />
      <div className="page-container">
        <TopBar onBack={() => setLocation("/")} light />

        <section className="feature-hero fade-up carte-hero">
          <div className="carte-kicker">
            <MapPin size={13} /> Fonctionnalité Wilaya+
          </div>
          <h1 className="section-title carte-title">Une carte qui respire avec les saisons.</h1>
          <p className="section-copy carte-copy">
            Pas une capture d'écran de fond de carte : un système où chaque route s'allume selon la saison
            choisie, pour montrer — pas juste raconter — où l'attention touristique se déplace au fil de l'année.
          </p>
          <span className="carte-honesty-badge">
            <Info size={12} /> Carte stylisée à but démonstratif, pas une projection géographique ni un flux de données mesuré
          </span>
        </section>

        <section className="carte-stage-section fade-up delay-1">
          <div className="carte-stage">
            <div className="carte-controls">
              <div className="carte-season-tabs" role="tablist" aria-label="Choisir une saison">
                {SEASONS.map((s, index) => {
                  const SeasonIcon = s.icon;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      role="tab"
                      aria-selected={index === seasonIndex}
                      className={`carte-season-tab ${index === seasonIndex ? "is-active" : ""}`}
                      onClick={() => { setSeasonIndex(index); setPlaying(false); }}
                    >
                      <SeasonIcon size={13} />
                      <span>{s.label}</span>
                      <small>{s.months}</small>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="carte-play-toggle"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Mettre en pause le cycle des saisons" : "Lancer le cycle des saisons"}
              >
                {playing ? <Pause size={15} /> : <Play size={15} />}
              </button>
            </div>

            <div className="carte-map-frame">
              <svg viewBox="0 0 640 500" className="carte-map-svg" role="img" aria-label={`Carte des flux touristiques illustratifs, saison ${season.label}`}>
                <defs>
                  <radialGradient id="carteGlow" cx="50%" cy="35%" r="75%">
                    <stop offset="0%" stopColor="rgba(216,154,43,.16)" />
                    <stop offset="100%" stopColor="rgba(216,154,43,0)" />
                  </radialGradient>
                  <filter id="carteNodeShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="rgba(0,0,0,.35)" />
                  </filter>
                </defs>

                <rect x="0" y="0" width="640" height="500" fill="url(#carteGlow)" />

                {/* Silhouette très simplifiée du territoire, suggérée plutôt que topographiquement exacte */}
                <path
                  d="M 40,60 L 600,50 L 620,180 L 590,470 L 40,480 L 20,200 Z"
                  className="carte-territory-outline"
                />

                {ROUTES.map((route, index) => {
                  const from = nodeById(route.from);
                  const to = nodeById(route.to);
                  if (!from || !to) return null;
                  const w = route.weight[seasonIndex];
                  const isBusiest = route === busiestRoute;
                  const midX = (from.x + to.x) / 2;
                  const midY = (from.y + to.y) / 2 - 18;
                  return (
                    <path
                      key={index}
                      d={`M ${from.x},${from.y} Q ${midX},${midY} ${to.x},${to.y}`}
                      className={`carte-route ${isBusiest ? "is-busiest" : ""}`}
                      style={{
                        "--route-opacity": 0.18 + w * 0.62,
                        "--route-width": 0.8 + w * 2.4,
                        "--route-duration": `${3.6 - w * 1.8}s`,
                      }}
                    />
                  );
                })}

                {NODES.map((node) => {
                  const isActive = activeNode?.id === node.id;
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      className={`carte-node ${isActive ? "is-active" : ""}`}
                      onMouseEnter={() => setActiveNode(node)}
                      onMouseLeave={() => setActiveNode((current) => (current?.id === node.id ? null : current))}
                      onFocus={() => setActiveNode(node)}
                      onBlur={() => setActiveNode((current) => (current?.id === node.id ? null : current))}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          event.currentTarget.blur();
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`${node.name} — ${node.region}`}
                      filter="url(#carteNodeShadow)"
                    >
                      <circle r={isActive ? 8.5 : 6} className="carte-node-dot" />
                      <circle r={isActive ? 15 : 11} className="carte-node-ring" />
                      <text y={-16} textAnchor="middle" className="carte-node-label">{node.name}</text>
                    </g>
                  );
                })}
              </svg>

              {activeNode && (
                <div className="carte-preview-card" style={{ "--preview-x": `${(activeNode.x / 640) * 100}%`, "--preview-y": `${(activeNode.y / 500) * 100}%` }}>
                  {photo ? <img src={photo} alt="" /> : <div className="carte-preview-fallback"><MapPin size={18} /></div>}
                  <div className="carte-preview-text">
                    <strong>{activeNode.name}</strong>
                    <span>{activeNode.region}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="carte-legend">
              <span><i className="carte-legend-swatch is-low" /> Flux faible</span>
              <span><i className="carte-legend-swatch is-high" /> Flux fort — {season.label.toLowerCase()}</span>
              <span className="carte-legend-hint">Survolez ou touchez un point pour voir la wilaya</span>
            </div>
          </div>
        </section>
        
        <section className="feature-section fade-up delay-3">
          <div className="fennec-reaction carte-fennec-reaction">
            <span style={{ fontSize: 40 }} aria-hidden="true">🦊</span>
            <div>
              <div className="reaction-label">Avis de Fennec</div>
              <p className="reaction-quote">« Une carte figée montre où on est allé. Une carte vivante montre où on devrait aller ensuite. »</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}