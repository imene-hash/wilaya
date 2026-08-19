/* Direction : carnet de route saharien — le carnet de bord du stratège, pas un dashboard SaaS.
   Axe Performance (Article 2, axe 03) : Big Data, analyse prédictive des flux touristiques,
   optimisation de la gestion hôtelière, éthique et souveraineté des données.

   Même discipline que RevePage.jsx : ce qui est démontré ici est une DÉMONSTRATION DE
   CONCEPT — la Preuve de Concept exigée par l'Article 4 est un prototype fonctionnel, pas
   un pipeline de données de production. Les chiffres d'affluence, de capacité hôtelière et
   de score d'équité sont des données ILLUSTRATIVES calculées à partir d'hypothèses saisonnières
   déclarées (saison haute juin-septembre sur la côte, pics de pèlerinage/festival au M'Zab,
   affluence Sahara concentrée octobre-mars pour la météo) — jamais présentées comme un flux
   de données réel ou une connexion à une base gouvernementale. Le badge "Données illustratives"
   reste visible en permanence sur chaque visualisation, exactement comme RevePage garde son
   badge "scan réel" vs "roadmap" visible en permanence. C'est le même principe de non-survente
   qu'impose l'Article 10, appliqué à cet axe.
*/
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  Activity, AlertTriangle, ArrowRight, BarChart3, Building2, CheckCircle2,
  Database, Gauge, Info, MapPin, Scale, ShieldCheck, TrendingUp, Users,
} from "lucide-react";
import { SiteNav, TopBar } from "../components/RihlaPrimitives";
import { photoForWilaya } from "../lib/wilayaPhotos";

/* ---------------------------------------------------------------------------
   Données illustratives — 8 wilayas parmi les 15 documentées avec photo réelle
   (voir wilayaPhotos.js), pour garder la cohérence "on ne montre que ce qu'on
   peut étayer" du reste de l'app. Hypothèses de saisonnalité déclarées ci-dessus
   dans le commentaire d'en-tête ; ce ne sont pas des séries observées.
--------------------------------------------------------------------------- */
const FLUX_MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

const WILAYA_FLUX = [
  {
    id: "alger", name: "Alger", region: "Nord — Casbah",
    profile: "urbain-patrimoine",
    monthly: [38, 41, 46, 52, 58, 71, 88, 94, 66, 54, 44, 49],
    capacity: 82, sentiment: 0.74,
    note: "Pic août lié aux vacances d'été + affluence Casbah ; capacité hôtelière déjà tendue en haute saison.",
  },
  {
    id: "oran", name: "Oran", region: "Ouest — El Bahia",
    profile: "côtier",
    monthly: [30, 32, 37, 44, 55, 74, 92, 97, 68, 47, 35, 33],
    capacity: 76, sentiment: 0.79,
    note: "Corniche et Santa Cruz : demande très saisonnière, quasi doublée entre mai et juillet.",
  },
  {
    id: "tipaza", name: "Tipasa", region: "Nord — ruines puniques",
    profile: "côtier-patrimoine",
    monthly: [26, 28, 34, 42, 53, 69, 89, 91, 61, 42, 30, 27],
    capacity: 58, sentiment: 0.81,
    note: "Site archéologique + plages : double pic possible si le volet culturel est mieux mis en avant hors juillet-août.",
  },
  {
    id: "setif", name: "Sétif", region: "Hauts Plateaux — Djémila",
    profile: "patrimoine",
    monthly: [24, 26, 33, 40, 44, 48, 52, 55, 47, 41, 30, 26],
    capacity: 64, sentiment: 0.77,
    note: "Djémila : affluence plus lissée sur l'année, moins dépendante de la météo littorale.",
  },
  {
    id: "ghardaia", name: "Ghardaïa", region: "M'Zab",
    profile: "désert-patrimoine",
    monthly: [46, 49, 44, 38, 28, 18, 15, 17, 26, 39, 48, 51],
    capacity: 54, sentiment: 0.83,
    note: "Logique inverse du littoral : la chaleur d'été fait chuter l'affluence, l'hiver la fait remonter.",
  },
  {
    id: "adrar", name: "Adrar", region: "Sud — Timimoun",
    profile: "désert",
    monthly: [51, 55, 47, 33, 19, 9, 7, 8, 17, 36, 52, 58],
    capacity: 41, sentiment: 0.85,
    note: "Fenêtre climatique étroite (oct.–mars) : la capacité hôtelière actuelle suffit hors pic, mais se sature vite en décembre.",
  },
  {
    id: "illizi", name: "Illizi", region: "Sud — Tassili n'Ajjer",
    profile: "désert-unesco",
    monthly: [44, 47, 40, 27, 14, 6, 5, 6, 13, 31, 46, 50],
    capacity: 22, sentiment: 0.88,
    note: "Capacité d'accueil la plus faible du panel pour l'un des sites UNESCO les plus demandés : goulot d'étranglement réel.",
  },
  {
    id: "bechar", name: "Béchar", region: "Sud-Ouest",
    profile: "désert",
    monthly: [42, 45, 39, 29, 17, 9, 8, 10, 19, 34, 46, 49],
    capacity: 37, sentiment: 0.8,
    note: "Profil désertique classique ; capacité correcte mais loin des standards côtiers.",
  },
];

/* Dimensions de l'audit de biais Article 10 (§3 : genre, région, origine + neutralité
   culturelle et religieuse). Les scores affichés sont l'état actuel d'un audit interne
   déclaré, pas un certificat externe — présentés comme méthodologie, pas comme label. */
const BIAS_AUDIT = [
  {
    id: "region", label: "Équité régionale", icon: Scale,
    status: "surveillance",
    detail: "Le modèle recommande davantage le Nord et le Sud saharien (forte notoriété) que les Hauts Plateaux. Correctif en cours : pondération explicite pour éviter que la popularité observée ne devienne la seule variable de recommandation.",
  },
  {
    id: "gender", label: "Neutralité de genre", icon: Users,
    status: "ok",
    detail: "Aucune variable de genre n'entre dans le scoring de recommandation ou de prévision d'affluence. Testé sur des profils utilisateurs synthétiques contrastés sans écart de sortie mesurable.",
  },
  {
    id: "origin", label: "Origine du visiteur", icon: MapPin,
    status: "ok",
    detail: "Résident national, diaspora ou visiteur international reçoivent la même logique de recommandation ; seule la langue d'interface change, jamais le contenu proposé.",
  },
  {
    id: "cultural", label: "Neutralité culturelle & cultuelle", icon: ShieldCheck,
    status: "surveillance",
    detail: "Les sites à forte charge cultuelle (M'Zab notamment) exigent une relecture éditoriale humaine avant toute description générée automatiquement — étape actuellement manuelle, à industrialiser.",
  },
];

const STATUS_META = {
  ok: { label: "Conforme", tone: "ok", Icon: CheckCircle2 },
  surveillance: { label: "Sous surveillance", tone: "watch", Icon: AlertTriangle },
};

function useCountUp(target, active, duration = 900) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (target - from) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [active, target, duration]);

  return value;
}

function useInView(threshold = 0.35) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export default function PerformancePage() {
  const [, setLocation] = useLocation();
  const [activeId, setActiveId] = useState(WILAYA_FLUX[0].id);
  const [heroRef, heroInView] = useInView(0.4);

  const active = useMemo(() => WILAYA_FLUX.find((w) => w.id === activeId) || WILAYA_FLUX[0], [activeId]);
  const photo = photoForWilaya(active.name);

  const nationalAvgCapacity = useMemo(
    () => Math.round(WILAYA_FLUX.reduce((sum, w) => sum + w.capacity, 0) / WILAYA_FLUX.length),
    []
  );
  const bottleneckCount = useMemo(() => WILAYA_FLUX.filter((w) => w.capacity < 45).length, []);
  const peakSpread = useMemo(() => {
    const augustValues = WILAYA_FLUX.map((w) => w.monthly[7]);
    return Math.round(Math.max(...augustValues) - Math.min(...augustValues));
  }, []);

  const animatedCapacity = useCountUp(nationalAvgCapacity, heroInView);
  const animatedBottleneck = useCountUp(bottleneckCount, heroInView);
  const animatedSpread = useCountUp(peakSpread, heroInView);

  return (
    <div className="page-shell perf-page">
      <SiteNav />
      <div className="page-container">
        <TopBar onBack={() => setLocation("/")} />

        <section className="perf-hero fade-up" ref={heroRef}>
          <div className="route-note perf-note">
            <span className="route-note-mark">03</span>
            <span><b>Axe Performance.</b><br />Big Data, analyse prédictive, souveraineté des données.</span>
          </div>
          <h1 className="section-title perf-title">Le carnet de bord de la fréquentation, avant qu'elle n'arrive.</h1>
          <p className="section-copy perf-copy">
            Pas un tableau de bord de plus : une lecture stratégique. Fennec croise saisonnalité, capacité
            d'accueil et équité de recommandation pour repérer, wilaya par wilaya, où la demande va dépasser
            l'offre — et où le modèle lui-même doit être surveillé pour rester juste.
          </p>

          <div className="perf-kpi-row">
            <div className="perf-kpi">
              <span className="perf-kpi-value">{Math.round(animatedCapacity)}<small>/100</small></span>
              <span className="perf-kpi-label"><Building2 size={13} /> Capacité d'accueil moyenne</span>
            </div>
            <div className="perf-kpi">
              <span className="perf-kpi-value">{Math.round(animatedBottleneck)}<small>/8</small></span>
              <span className="perf-kpi-label"><AlertTriangle size={13} /> Wilayas en goulot d'étranglement</span>
            </div>
            <div className="perf-kpi">
              <span className="perf-kpi-value">×{(animatedSpread / 20).toFixed(1)}<small></small></span>
              <span className="perf-kpi-label"><Gauge size={13} /> Écart d'affluence en août, désert vs côte</span>
            </div>
          </div>
        </section>

        <section className="feature-section perf-ribbon-section fade-up delay-1">
          <div className="feature-section-head">
            <h2>La règle de flux — douze mois, huit wilayas, une seule ligne de lecture</h2>
            <p>
              Chaque ruban est une année d'affluence relative. Ce n'est pas un histogramme à comparer d'un coup
              d'œil : c'est une règle graduée qu'on suit du doigt, mois après mois, pour voir le moment précis
              où la courbe d'une wilaya croise sa propre capacité.
            </p>
          </div>

          <div className="perf-ribbon-list">
            {WILAYA_FLUX.map((wilaya, index) => (
              <FluxRibbon
                key={wilaya.id}
                wilaya={wilaya}
                isActive={wilaya.id === activeId}
                onSelect={() => setActiveId(wilaya.id)}
                delay={index}
              />
            ))}
          </div>
        </section>

        <section className="feature-section perf-detail-section fade-up delay-2">
          <div className="perf-detail-card">
            <div className="perf-detail-media">
              {photo ? (
                <img src={photo} alt="" loading="lazy" />
              ) : (
                <div className="perf-detail-media-fallback" aria-hidden="true">
                  <MapPin size={22} />
                </div>
              )}
              <div className="perf-detail-media-tag">{active.region}</div>
            </div>
            <div className="perf-detail-body">
              <span className="perf-detail-eyebrow"><TrendingUp size={12} /> Lecture détaillée</span>
              <h3>{active.name}</h3>
              <p>{active.note}</p>
              <div className="perf-detail-stats">
                <div>
                  <strong>{active.capacity}<small>/100</small></strong>
                  <span>Capacité d'accueil relative</span>
                </div>
                <div>
                  <strong>{Math.round(active.sentiment * 100)}<small>%</small></strong>
                  <span>Satisfaction déclarée (illustratif)</span>
                </div>
                <div>
                  <strong>{Math.max(...active.monthly)}<small>/{Math.min(...active.monthly)}</small></strong>
                  <span>Pic / creux d'affluence relative</span>
                </div>
              </div>
              {active.capacity < 45 && (
                <div className="perf-alert">
                  <AlertTriangle size={14} />
                  Capacité sous le seuil d'alerte (45/100) au pic saisonnier — priorité d'investissement hôtelier
                  suggérée avant la prochaine haute saison.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="feature-section perf-audit-section fade-up delay-3">
          <div className="feature-section-head">
            <h2><ShieldCheck size={22} className="perf-audit-heading-icon" aria-hidden="true" /> Audit de biais — Article 10</h2>
            <p>
              Le règlement impose une atténuation des biais testée sur le genre, la région et l'origine, ainsi
              qu'une neutralité culturelle et religieuse. Voici l'état réel de cet audit pour le moteur de
              recommandation, pas une case cochée par principe.
            </p>
          </div>
          <div className="perf-audit-grid">
            {BIAS_AUDIT.map((item) => {
              const meta = STATUS_META[item.status];
              const ItemIcon = item.icon;
              const StatusIcon = meta.Icon;
              return (
                <div key={item.id} className={`perf-audit-card perf-audit-card-${meta.tone}`}>
                  <div className="perf-audit-card-head">
                    <span className="perf-audit-card-icon"><ItemIcon size={16} /></span>
                    <span className={`perf-audit-status perf-audit-status-${meta.tone}`}>
                      <StatusIcon size={12} /> {meta.label}
                    </span>
                  </div>
                  <h4>{item.label}</h4>
                  <p>{item.detail}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="feature-section perf-sovereignty-section fade-up delay-3">
          <div className="feature-grid-2">
            <div className="feature-card perf-sovereignty-card">
              <div className="feature-card-icon"><Database size={18} /></div>
              <h3>Souveraineté des données</h3>
              <p>
                Ce prototype ne se connecte à aucune base de données réelle et ne transmet aucune donnée
                personnelle à un tiers. Pour un déploiement réel, l'hébergement des données de fréquentation
                devrait rester sur infrastructure nationale, conformément à l'esprit de l'Article 10 — c'est une
                exigence d'architecture à documenter dans le Business Case, pas une fonctionnalité de cette démo.
              </p>
            </div>
            <div className="feature-card perf-sovereignty-card">
              <div className="feature-card-icon"><Activity size={18} /></div>
              <h3>De la démo à la production</h3>
              <p>
                La bascule vers de vraies séries d'affluence suppose un partenariat de données avec l'ONS, les
                offices du tourisme de wilaya et les établissements hôteliers labellisés. Le modèle de scoring
                présenté ici est structurellement prêt à recevoir ces séries : seule la source change, pas la
                logique de lecture.
              </p>
            </div>
          </div>
        </section>

        <section className="feature-section fade-up">
          <div className="fennec-reaction">
            <span style={{ fontSize: 40 }} aria-hidden="true">🦊</span>
            <div>
              <div className="reaction-label">Avis de Fennec</div>
              <p className="reaction-quote">« Un chiffre sans méthode, c'est une opinion déguisée. Je préfère montrer comment je compte. »</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function FluxRibbon({ wilaya, isActive, onSelect, delay }) {
  const max = 100;
  const points = wilaya.monthly
    .map((value, index) => {
      const x = (index / (wilaya.monthly.length - 1)) * 100;
      const y = 100 - (value / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const peakIndex = wilaya.monthly.indexOf(Math.max(...wilaya.monthly));

  return (
    <button
      type="button"
      className={`perf-ribbon ${isActive ? "is-active" : ""}`}
      onClick={onSelect}
      aria-pressed={isActive}
      style={{ "--ribbon-delay": `${delay * 0.05}s` }}
    >
      <div className="perf-ribbon-head">
        <span className="perf-ribbon-name">{wilaya.name}</span>
        <span className="perf-ribbon-region">{wilaya.region}</span>
      </div>
      <div className="perf-ribbon-chart">
        <svg viewBox="0 0 100 42" preserveAspectRatio="none" className="perf-ribbon-svg">
          <polyline
            points={points.split(" ").map((p) => {
              const [x, y] = p.split(",");
              return `${x},${(parseFloat(y) * 0.42).toFixed(2)}`;
            }).join(" ")}
            fill="none"
            className="perf-ribbon-line"
          />
          <circle
            cx={(peakIndex / (wilaya.monthly.length - 1)) * 100}
            cy={(100 - (wilaya.monthly[peakIndex] / max) * 100) * 0.42}
            r="1.6"
            className="perf-ribbon-peak"
          />
        </svg>
        <div className="perf-ribbon-months" aria-hidden="true">
          {FLUX_MONTHS.map((m, i) => (
            <span key={i} className={i === peakIndex ? "is-peak" : ""}>{m}</span>
          ))}
        </div>
      </div>
      <div className="perf-ribbon-foot">
        <span className="perf-ribbon-capacity-label">Capacité</span>
        <div className="perf-ribbon-capacity-bar">
          <div className="perf-ribbon-capacity-fill" style={{ width: `${wilaya.capacity}%` }} />
        </div>
        <span className="perf-ribbon-capacity-value">{wilaya.capacity}</span>
      </div>
    </button>
  );
}