/* Direction : carnet de route saharien — les primitives combinent repères imprimés, humour et gestes de voyage. */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Compass, Copy, Download, Menu, RotateCcw, Sparkles, X } from "lucide-react";
import { ASSETS, BUDGETS, MOODS } from "../lib/wilayaData";
import { photoForWilaya } from "../lib/wilayaPhotos";

export const SITE_SECTIONS = [
  { path: "/reve", label: "Rêve — AR & 3D", short: "Rêve" },
  { path: "/sur-mesure", label: "Sur-Mesure — Copilot IA", short: "Sur-Mesure" },
  { path: "/carte-vivante", label: "Carte Vivante & Flux", short: "Carte" },
  { path: "/passeport", label: "Passeport du Voyageur", short: "Passeport" },
];

export function SiteNav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-nav">
      <div className="page-container site-nav-inner">
        <Link href="/" className="site-nav-brand" onClick={() => setOpen(false)}>
          <BrandLockup />
        </Link>
        <nav className="site-nav-links" aria-label="Sections du concours">
          {SITE_SECTIONS.map((section) => (
            <Link key={section.path} href={section.path} className={`site-nav-link ${location === section.path ? "is-active" : ""}`}>
              {section.short}
            </Link>
          ))}
        </nav>
        <button type="button" className="site-nav-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open}>
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {open && (
        <nav className="site-nav-sheet" aria-label="Sections du concours (mobile)">
          {SITE_SECTIONS.map((section) => (
            <Link key={section.path} href={section.path} className={`site-nav-sheet-link ${location === section.path ? "is-active" : ""}`} onClick={() => setOpen(false)}>
              {section.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function BrandLockup({ light = false }) {
  return (
    <div className="brand-lockup" aria-label="Wilaya+">
      <img className="brand-mark" src={ASSETS.mark} alt="" />
      <div>
        <div className={`brand-ar ${light ? "!text-[var(--paper)]" : ""}`}>ولاية</div>
        <span className={`brand-latin ${light ? "!text-[rgba(255,250,242,.65)]" : ""}`}>Wilaya+</span>
      </div>
    </div>
  );
}

export function TopBar({ step, onBack, light = false, center = false }) {
  return (
    <div className={`topbar ${light ? "!text-[var(--paper)]" : ""}`}>
      {onBack ? (
        <button className={`topbar-button ${light ? "!border-[rgba(255,250,242,.25)] !bg-white/10 !text-[var(--paper)]" : ""}`} onClick={onBack} aria-label="Retour">
          <ArrowLeft size={15} /> <span className="hidden sm:inline">Retour</span>
        </button>
      ) : <BrandLockup light={light} />}
      {center && <div className="font-arabic text-[15px] opacity-80">ولاية <span className="font-display text-[11px] tracking-[.14em]">WILAYA+</span></div>}
      {step && <div className="topbar-step">{step}</div>}
    </div>
  );
}

export function FennecAvatar({ pose = "hype", scene = false, className = "", alt = "Fennec" }) {
  const source = {
    hype: scene ? ASSETS.heroVictoryScene : ASSETS.heroVictory,
    proud: scene ? ASSETS.heroCityScene : ASSETS.heroCity,
    thinking: ASSETS.thinking,
    skeptic: ASSETS.thinkingAlt,
    shocked: ASSETS.reactions,
  }[pose] || ASSETS.heroVictory;
  return <img className={`avatar-cutout fennec-avatar ${className}`} src={source} alt={alt} />;
}

export function MoodCard({ mood, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`mood-card ${selected ? "is-selected" : ""}`}
      style={{ "--mood-color": mood.color }}
      onClick={() => onSelect(mood.id)}
      aria-pressed={selected}
    >
      <span className="mood-emoji" aria-hidden="true">{mood.emoji}</span>
      <span className="mood-ar font-arabic">{mood.labelAr}</span>
      <strong>{mood.label}</strong>
      <span>{mood.description}</span>
    </button>
  );
}

export function BudgetOption({ budget, selected, onSelect }) {
  const item = BUDGETS.find((entry) => entry.id === budget);
  return (
    <button type="button" className={`budget-option ${selected ? "is-selected" : ""}`} onClick={() => onSelect(budget)} aria-pressed={selected}>
      <span>{item.icon} &nbsp;{item.label}</span>
      <small>{item.hint}</small>
    </button>
  );
}

export function ProgressDots({ count, active, onSelect }) {
  return (
    <div className="progress-dots" aria-label="Progression des étapes">
      {Array.from({ length: count }).map((_, index) => (
        <button type="button" key={index} className={index === active ? "is-active" : ""} onClick={() => onSelect?.(index)} aria-label={`Voir l’étape ${index + 1}`} />
      ))}
    </div>
  );
}

export function ArrowControls({ onPrevious, onNext, disablePrevious, disableNext }) {
  return (
    <div className="carousel-controls">
      <button className="carousel-arrow" type="button" onClick={onPrevious} disabled={disablePrevious} aria-label="Étape précédente"><ChevronLeft size={17} /></button>
      <button className="carousel-arrow" type="button" onClick={onNext} disabled={disableNext} aria-label="Étape suivante"><ChevronRight size={17} /></button>
    </div>
  );
}

export function ItineraryCard({ site }) {
  return (
    <article className="itinerary-card">
      <div className="card-cover" style={{ "--card-gradient": site.cover_gradient }}>
        <div className="card-day">Jour {String(site.day).padStart(2, "0")} · {site.wilaya}</div>
        <div className="card-location">{site.name}</div>
        <div className="card-cover-icon" aria-hidden="true">{site.icon}</div>
      </div>
      <div className="card-body">
        <div className="card-meta">{site.tags.map((tag) => <span className="card-tag" key={tag}>#{tag}</span>)}</div>
        <h3>{site.name}</h3>
        <p className="card-description">{site.description}</p>
        <div className="card-facts">
          <span><Compass size={13} style={{ verticalAlign: "-2px" }} /> &nbsp;<strong>{site.duration_hours} h</strong> sur place</span>
          <span><strong>{site.budget_level === 1 ? "Doux" : "Confort"}</strong> côté budget</span>
        </div>
        <div className="tip-box"><strong>Conseil pratique</strong>{site.tip}</div>
        {site.le_fennec_tip && <div className="fennec-tip"><FennecAvatar pose="skeptic" alt="Fennec donne un conseil" /> <span><b>Fennec :</b> « {site.le_fennec_tip} »</span></div>}
      </div>
    </article>
  );
}

/* Panneau plein cadre pour une étape de l'itinéraire (v2, page cinématique).
   Photo réelle de la wilaya quand elle existe (15/58 aujourd'hui) ; sinon,
   plaque gravée générée à partir des données de l'étape elle-même
   (cover_gradient + icon), jamais une image cassée ni un placeholder générique. */
export function ItineraryStagePanel({ site, isActive }) {
  const photo = photoForWilaya(site.wilaya);

  return (
    <div className={`itn2-panel ${isActive ? "is-active" : ""}`} style={{ "--panel-plate": site.cover_gradient }}>
      {photo ? (
        <img className="itn2-panel-photo" src={photo} alt="" loading={isActive ? "eager" : "lazy"} />
      ) : (
        <div className="itn2-panel-plate">
          <span className="itn2-panel-plate-icon" aria-hidden="true">{site.icon}</span>
          <span className="itn2-panel-plate-badge">
            <Compass size={11} /> Fennec dessine {site.wilaya}
          </span>
        </div>
      )}
      <div className="itn2-panel-scrim" aria-hidden="true" />

      <div className="itn2-panel-stamp">
        <span className="itn2-panel-stamp-num">{String(site.day).padStart(2, "0")}</span>
        <span className="itn2-panel-stamp-wilaya">{site.wilaya}</span>
      </div>

      <div className="itn2-panel-body">
        <div className="itn2-panel-tags">
          {site.tags.map((tag) => <span className="itn2-panel-tag" key={tag}>#{tag}</span>)}
        </div>
        <h3 className="itn2-panel-title">{site.name}</h3>
        <p className="itn2-panel-desc">{site.description}</p>
        <div className="itn2-panel-facts">
          <span className="itn2-panel-fact"><Compass size={12} /> <strong>{site.duration_hours} h</strong>&nbsp;sur place</span>
          <span className="itn2-panel-fact"><strong>{site.budget_level === 1 ? "Doux" : "Confort"}</strong>&nbsp;côté budget</span>
        </div>
      </div>
    </div>
  );
}

/* Vignette cliquable de la piste miniature (filmstrip) sous le panneau actif. */
export function ItineraryThumb({ site, isActive, onClick }) {
  const photo = photoForWilaya(site.wilaya);
  return (
    <button
      type="button"
      className={`itn2-thumb ${isActive ? "is-active" : ""}`}
      style={{ "--thumb-plate": site.cover_gradient }}
      onClick={onClick}
      aria-label={`Aller au jour ${site.day} — ${site.name}`}
      aria-current={isActive}
    >
      {photo ? <img src={photo} alt="" loading="lazy" /> : <span className="itn2-thumb-icon" aria-hidden="true">{site.icon}</span>}
      <span className="itn2-thumb-day">{String(site.day).padStart(2, "0")}</span>
    </button>
  );
}

export function ActionIcon({ kind }) {
  const Icon = { download: Download, copy: Copy, reset: RotateCcw, sparkles: Sparkles, arrow: ArrowRight }[kind] || Sparkles;
  return <Icon size={16} strokeWidth={2.2} />;
}