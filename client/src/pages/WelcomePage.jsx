/* Direction : carnet de route saharien — accueil épuré, utile et engageant */
import { useState } from "react";
import ConcoursModal from "../components/ConcoursModal";
import ImmersiveARModal from "../components/ImmersiveARModal";
import AnalyticsModal from "../components/AnalyticsModal";
import PitchJuryModal from "../components/PitchJuryModal";
import CopilotModal from "../components/CopilotModal";
import PassportModal from "../components/PassportModal";
import LiveMapModal from "../components/LiveMapModal";
import CandidateKitModal from "../components/CandidateKitModal";
import WilayasExploreSection from "../components/WilayasExploreSection";
import { ArrowRight, Sparkles, Compass, ShieldCheck, BarChart3, Stamp, Radar, FileText } from "lucide-react";
import { useLocation } from "wouter";
import { ASSETS } from "../lib/wilayaData";
import { BrandLockup } from "../components/RihlaPrimitives";

export default function WelcomePage() {
  const [, setLocation] = useLocation();
  const [showConcoursModal, setShowConcoursModal] = useState(false);
  const [showARModal, setShowARModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [showCopilotModal, setShowCopilotModal] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showLiveMapModal, setShowLiveMapModal] = useState(false);
  const [showKitModal, setShowKitModal] = useState(false);

  return (
    <div className="page-shell home-hero min-h-screen flex flex-col justify-between">
      <div className="page-container home-nav pt-4">
        <BrandLockup />
      </div>

      <main className="page-container hero-grid my-auto py-8">
        <div className="hero-video-layer" aria-hidden="true">
          <video
            src="/flag-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onError={(e) => console.error("hero flag video failed to load:", e.currentTarget.error)}
          />
        </div>

        <section className="hero-copy fade-up">
          <div className="hero-kicker"><Sparkles size={15} /> Le carnet de route intelligent de l’Algérie</div>
          <h1 className="hero-title text-balance">Découvrez l’Algérie autrement, <em>sur-mesure.</em></h1>
          <p className="hero-description">Planifiez votre voyage à travers 69 wilayas en quelques clics. Fennec, votre guide IA, conçoit un itinéraire authentique qui protège le patrimoine et valorise l'artisanat local.</p>
          
          <div className="hero-actions pt-2">
            <button className="btn-primary" type="button" onClick={() => setLocation("/mood")}>
              Créer mon itinéraire <ArrowRight size={17} />
            </button>
            <button className="btn-ghost" type="button" onClick={() => setShowCopilotModal(true)}>
              Discuter avec Fennec
            </button>
          </div>

          <div className="flex flex-wrap gap-3 pt-6 text-xs text-[#7c3426]/80">
            <span className="flex items-center gap-1.5 font-semibold">✓ 100% Gratuit et sans inscription</span>
            <span className="flex items-center gap-1.5 font-semibold"></span>
            <span className="flex items-center gap-1.5 font-semibold">✓ Export Story & Passeport numérique</span>
          </div>
        </section>

        <section className="hero-visual relative">
          <div className="scene-card shadow-2xl rounded-3xl overflow-hidden border-2 border-[#b85631]/30 bg-[#f9f1e7]">
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-[#b85631] shadow-sm flex items-center gap-1.5 z-10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Fennec en direct
            </div>
            <img className="scene-bg w-full h-[380px] object-cover" src={ASSETS.heroVictory} alt="Fennec compagnon de voyage" />
          </div>
        </section>
      </main>

      {/* Featured destinations section for immediate utility */}
      <WilayasExploreSection />

      {/* Concours & Toolbar Footer */}
      <div className="bg-[#f2e6d8]/70 border-t border-[#b85631]/20 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-semibold text-[#7c3426]">Explorer l'application :</span>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setLocation("/reve")} className="module-chip">
              <Sparkles size={15} /> Axe Rêve (AR & 3D)
            </button>
            <button onClick={() => setLocation("/passeport")} className="module-chip">
              <Stamp size={15} /> Passeport & Tampons
            </button>
            <button onClick={() => setLocation("/carte-vivante")} className="module-chip">
              <Radar size={15} /> Carte Vivante & Flux
            </button>
          </div>
        </div>
      </div>

      <footer className="page-container home-footer py-4 text-center text-xs text-[#7c3426]/70 border-t border-[#b85631]/10">
        Wilaya+ · 2026 © ولاية — conçu pour l'excellence du tourisme algérien
      </footer>

      <ConcoursModal isOpen={showConcoursModal} onClose={() => setShowConcoursModal(false)} />
      <ImmersiveARModal isOpen={showARModal} onClose={() => setShowARModal(false)} />
      <AnalyticsModal isOpen={showAnalyticsModal} onClose={() => setShowAnalyticsModal(false)} />
      <PitchJuryModal isOpen={showPitchModal} onClose={() => setShowPitchModal(false)} />
      <CopilotModal isOpen={showCopilotModal} onClose={() => setShowCopilotModal(false)} />
      <PassportModal isOpen={showPassportModal} onClose={() => setShowPassportModal(false)} />
      <LiveMapModal isOpen={showLiveMapModal} onClose={() => setShowLiveMapModal(false)} />
      <CandidateKitModal isOpen={showKitModal} onClose={() => setShowKitModal(false)} />
    </div>
  );
}