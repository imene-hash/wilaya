/* Mode Immersif AR/VR et Guide Holographique Fennec */
import { useState } from "react";
import { Sparkles, Glasses, Volume2, Compass, Layers, X } from "lucide-react";

export default function ImmersiveARModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("hologram");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#201b2d] border border-[#d89a2b]/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-white p-6 md:p-8">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-[#d89a2b]/20 text-[#f5c35c] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Glasses className="w-3.5 h-3.5" /> Axe Rêve — Immersion & NeRF 3D
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold font-['Outfit'] mb-2 text-[#fffaf0]">
          Fennec AR & Audioguide Conteur
        </h2>
        <p className="text-sm text-white/70 mb-6">
          Expérience immersive interactive aux standards du Concours IA Tour 2026. Visualisez les monuments en 3D et écoutez le conteur local.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
          <button 
            onClick={() => setActiveTab("hologram")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'hologram' ? 'bg-[#b85631] text-white shadow-lg' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
          >
            <Sparkles className="w-4 h-4" /> Fennec Holographique 3D
          </button>
          <button 
            onClick={() => setActiveTab("audioguide")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'audioguide' ? 'bg-[#b85631] text-white shadow-lg' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
          >
            <Volume2 className="w-4 h-4" /> Audioguide Conteur Berbère & Arabe
          </button>
          <button 
            onClick={() => setActiveTab("nerf")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'nerf' ? 'bg-[#b85631] text-white shadow-lg' : 'bg-white/5 text-white/10'}`}
          >
            <Layers className="w-4 h-4" /> Reconstruction NeRF
          </button>
        </div>

        {activeTab === "hologram" && (
          <div className="space-y-4">
            <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-b from-[#321f2b] to-[#141019] border border-white/10 flex items-center justify-center p-6 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(216,154,43,0.15),transparent_70%)]" />
              <div className="relative z-10 space-y-3">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-[#d89a2b] to-[#b85631] p-1 shadow-2xl animate-pulse">
                  <div className="w-full h-full rounded-full bg-[#201b2d] flex items-center justify-center">
                    <span className="text-3xl">🐫</span>
                  </div>
                </div>
                <h3 className="font-['Outfit'] font-bold text-lg text-[#f5c35c]">Fennec en Réalité Augmentée</h3>
                <p className="text-xs text-white/80 max-w-sm mx-auto">
                  « Assalamou Aleykoum ! Pointez votre smartphone vers la place centrale pour m'animer en taille réelle sur vos écrans. »
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[11px] font-semibold">
                    ● Caméra AR active (Simulation WebGL)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "audioguide" && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold font-['Outfit'] text-base text-[#f5c35c]">Légende de la Tassili n'Ajjer</h4>
                  <p className="text-xs text-white/60">Généré par IA Vocale • Voix chaleureuse & contes ancestraux</p>
                </div>
                <button 
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-12 h-12 rounded-full bg-[#d89a2b] text-[#201b2d] flex items-center justify-center font-bold shadow-lg hover:scale-105 transition-transform"
                >
                  {isPlayingAudio ? "⏸" : "▶"}
                </button>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className={`bg-[#d89a2b] h-full transition-all duration-500 ${isPlayingAudio ? 'w-3/4' : 'w-1/4'}`} />
              </div>
              <p className="text-xs text-white/80 italic leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                « Au cœur des roches sculptées par le vent du Tassili, chaque gravure raconte le secret des premiers nomades et le chant des étoiles... »
              </p>
            </div>
          </div>
        )}

        {activeTab === "nerf" && (
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 relative" style={{ aspectRatio: "4 / 3" }}>
              <iframe
                title="Marché romain de Djémila — scan 3D (Zamani Project, UCT)"
                src="https://sketchfab.com/models/b7a098b6197b418c8e500ad5b2f12eb0/embed?autostart=0&ui_theme=dark"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
              />
            </div>
            <div className="px-1 space-y-1.5">
              <h4 className="font-bold font-['Outfit'] text-sm text-[#fffaf0]">Le marché romain de Djémila — scan laser réel</h4>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Djémila (site UNESCO depuis 1982) documenté par relevé laser-scanning terrestre en 2013–2014, projet Zamani Heritage
                (Université du Cap) avec l'Université de Sétif. Rotation, zoom et plein écran fonctionnent directement dans le cadre
                ci-dessus — c'est le modèle 3D réel, pas une capture d'écran.
              </p>
              <p className="text-[10px] text-white/40">
                Modèle hébergé et diffusé par Sketchfab · <span className="text-white/60">@zamaniproject</span>
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition-colors"
          >
            Fermer l'immersion
          </button>
        </div>
      </div>
    </div>
  );
}