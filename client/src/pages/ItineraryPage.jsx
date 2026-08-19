/* Direction : carnet de route saharien — l'itinéraire devient une traversée : un fil de route continu,
   une étape plein cadre à la fois, chaque jour révélé comme un tampon posé sur une photo réelle du pays
   (ou, quand la photo n'existe pas encore pour cette wilaya, une plaque gravée honnête plutôt qu'un
   espace vide). Le renard reste le guide, mais la vedette est la route elle-même. */
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { useWilaya } from "../contexts/WilayaContext";
import {
  FennecAvatar,
  ItineraryStagePanel,
  ItineraryThumb,
  TopBar,
} from "../components/RihlaPrimitives";
import "../itinerary-v2.css";

export default function ItineraryPage() {
  const [, setLocation] = useLocation();
  const { itinerary, resetAll } = useWilaya();
  const [activeIndex, setActiveIndex] = useState(0);
  const data = itinerary;

  useEffect(() => {
    if (!data) setLocation("/mood");
  }, [data, setLocation]);

  if (!data) return null;

  const total = data.sites.length;
  const activeSite = data.sites[activeIndex];
  const progressPct = total > 1 ? (activeIndex / (total - 1)) * 100 : 100;

  const goTo = (index) => setActiveIndex(Math.max(0, Math.min(total - 1, index)));
  const restart = () => { resetAll(); setLocation("/"); };

  return (
    <div className="page-shell itn2">
      <div className="page-container">
        <TopBar step={`sur ${data.total_days}`} onBack={() => setLocation("/mood")} center />

        <main>
          {/* ---- Fil de route : traverse toute la page, se remplit avec la progression ---- */}
          <div className="itn2-thread-rail" aria-hidden="true">
            <div className="itn2-thread-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <section className="itn2-hero fade-up">
            {/* -- Colonne gauche : titre éditorial, sur le papier -- */}
            <div className="itn2-hero-main">
              <div className="itn2-hero-kicker">Ton itinéraire</div>
              <h1>{data.title}</h1>
              <div className="itn2-hero-pills">
                <span className="hero-pill">{data.total_days} jours</span>
                <span className="hero-pill">{total} escales</span>
                <span className="hero-pill">58 wilayas, une seule route</span>
              </div>
            </div>

            {/* -- Colonne droite : carte Fennec + étapes du circuit en stepper -- */}
            <div className="itn2-hero-card grain-panel">
              <div className="itn2-hero-card-inner">
                <div className="hero-verdict-label">Le verdict de Fennec</div>
                <p className="verdict-quote">« {data.le_fennec_comment} »</p>
                <ol className="itn2-circuit-stepper">
                  {data.sites.map((site, index) => (
                    <li key={site.id ?? index}>
                      <span className="itn2-circuit-dot" aria-hidden="true" />
                      <span className="itn2-circuit-stop">{site.wilaya}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <div className="itn2-step-head">
            <div>
              <div className="eyebrow">Ton itinéraire étape par étape</div>
              <h2>{activeSite.name}</h2>
            </div>
            <div className="itn2-stage-count">Jour <b>{String(activeSite.day).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}</div>
          </div>

          {/* ---- Panneau plein cadre : une seule étape visible, transition douce ---- */}
          <div className="itn2-viewport">
            <div className="itn2-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
              {data.sites.map((site, index) => (
                <ItineraryStagePanel key={site.id ?? index} site={site} isActive={index === activeIndex} />
              ))}
            </div>
          </div>

          {/* ---- Volet détail : conseil pratique + remarque de Fennec pour l'étape active ---- */}
          <div className="itn2-detail fade-up">
            <div className="itn2-detail-tip"><strong>Conseil pratique</strong>{activeSite.tip}</div>
            {activeSite.le_fennec_tip && (
              <div className="itn2-detail-fennec">
                <FennecAvatar pose="skeptic" alt="Fennec donne un conseil" />
                <span><b>Fennec :</b> « {activeSite.le_fennec_tip} »</span>
              </div>
            )}
          </div>

          {/* ---- Navigation : flèches + piste miniature façon carnet ---- */}
          <div className="itn2-nav">
            <button className="itn2-nav-arrow" type="button" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Étape précédente">
              <ChevronLeft size={18} />
            </button>
            <div className="itn2-filmstrip" role="tablist" aria-label="Étapes de l'itinéraire">
              {data.sites.map((site, index) => (
                <ItineraryThumb key={site.id ?? index} site={site} isActive={index === activeIndex} onClick={() => goTo(index)} />
              ))}
            </div>
            <button className="itn2-nav-arrow" type="button" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === total - 1} aria-label="Étape suivante">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="itn2-actions">
            <button className="btn-ghost" type="button" onClick={restart}><ArrowLeft size={16} /> Recommencer</button>
            <button className="btn-primary" type="button" onClick={() => setLocation("/export")}>Exporter ma Story <ArrowRight size={16} /></button>
          </div>
        </main>
      </div>
    </div>
  );
}