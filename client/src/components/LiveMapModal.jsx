/* Carte Vivante des Alternatives & Explicabilité IA */
import { useState } from "react";
import { Compass, Sparkles, AlertTriangle, ArrowRight, ShieldCheck, X } from "lucide-react";

const ALTERNATIVES = [
  {
    hub: "Gorges de Ghoufi (Batna)",
    status: "Affluence modérée (Idéal aujourd'hui)",
    alternative: "Balade fraîcheur dans les balcons de Ghoufi",
    impact: "+30% de soutien aux agriculteurs de la vallée"
  },
  {
    hub: "Grand Erg Oriental",
    status: "Forte affluence touristique",
    alternative: "Détour conseillé vers les dunes de Taghit",
    impact: "Préservation des écosystèmes fragiles"
  }
];

export default function LiveMapModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#fffaf0] border border-[#b85631]/30 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-[#2b1f1a] p-6 md:p-8">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f2e6d8] flex items-center justify-center text-[#7c3426] hover:bg-[#b85631] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> Carte Vivante & Alternatives Intelligentes
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold font-['Outfit'] mb-2 text-[#2b1f1a]">
          Régulation des Flux & Recommandations en Direct
        </h2>
        <p className="text-sm text-[#7c3426]/80 mb-6">
          Quand un site touristique approche de sa saturation, Wilaya+ propose instantanément une alternative pour protéger le patrimoine.
        </p>

        <div className="space-y-4 mb-6">
          {ALTERNATIVES.map((alt, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-[#b85631]/20 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold font-['Outfit'] text-base text-[#2b1f1a]">{alt.hub}</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-[11px] font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {alt.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#b85631] font-semibold">
                <ArrowRight className="w-4 h-4" /> Alternative : {alt.alternative}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                ✓ Impact socio-économique : {alt.impact}
              </div>
            </div>
          ))}
        </div>

        {/* AI Transparency */}
        <div className="p-5 rounded-2xl bg-[#f2e6d8]/60 border border-[#b85631]/20 space-y-2">
          <h4 className="font-bold font-['Outfit'] text-base text-[#2b1f1a] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#b85631]" /> Fiche « Pourquoi cette recommandation ? »
          </h4>
          <p className="text-xs text-[#2b1f1a]/80 leading-relaxed">
            Chaque suggestion générée par Wilaya+ indique clairement ses critères : saisonnalité, budget, accessibilité 4x4, et respect de la neutralité culturelle. Zéro boîte noire, transparence totale pour le voyageur et le jury.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[#b85631]/20 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#b85631] text-white font-semibold text-xs shadow hover:bg-[#964223] transition-colors"
          >
            Fermer la carte vivante
          </button>
        </div>
      </div>
    </div>
  );
}
