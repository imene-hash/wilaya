/* Mode Performance & Big Data - Axe 03 Concours */
import { TrendingUp, Users, ShieldAlert, BarChart3, Globe, X } from "lucide-react";

export default function AnalyticsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#fffaf0] border border-[#b85631]/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-[#2b1f1a] p-6 md:p-8">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f2e6d8] flex items-center justify-center text-[#7c3426] hover:bg-[#b85631] hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Axe Performance — Big Data & Flux
          </span>
          <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-bold uppercase tracking-wider">
            Aperçu Roadmap — Post-Concours
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold font-['Outfit'] mb-2 text-[#2b1f1a]">
          Tableau de Bord & Optimisation des Flux
        </h2>
        <p className="text-sm text-[#7c3426]/80 mb-6">
          Vision produit pour la phase post-concours. Les chiffres ci-dessous sont des valeurs d'exemple pour illustrer la mise en page ; aucune donnée institutionnelle ou pipeline live n'est branché dans ce prototype.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-white border border-[#b85631]/20 shadow-sm">
            <div className="text-xs text-[#7c3426] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Affluence Saharienne
            </div>
            <div className="text-2xl font-bold font-['Outfit'] text-[#b8ab98]">14 280</div>
            <div className="text-[11px] text-[#7c3426]/60 font-semibold mt-1">valeur d'exemple, non connectée</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#b85631]/20 shadow-sm">
            <div className="text-xs text-[#7c3426] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" /> Indice de Satisfaction
            </div>
            <div className="text-2xl font-bold font-['Outfit'] text-[#b8ab98]">4.9 / 5.0</div>
            <div className="text-[11px] text-[#7c3426]/60 font-semibold mt-1">valeur d'exemple, non connectée</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#b85631]/20 shadow-sm">
            <div className="text-xs text-[#7c3426] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Empreinte & Éthique
            </div>
            <div className="text-lg font-bold font-['Outfit'] text-[#2b1f1a]">Cadre à auditer</div>
            <div className="text-[11px] text-[#7c3426]/60 font-semibold mt-1">audit de sécurité prévu, non réalisé</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#f2e6d8]/60 border border-[#b85631]/20 space-y-3">
          <h4 className="font-bold font-['Outfit'] text-base text-[#2b1f1a] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#b85631]" /> Répartition Intelligente des Flux Touristiques
          </h4>
          <p className="text-xs text-[#2b1f1a]/80 leading-relaxed">
            Dans sa cible produit, Wilaya+ pourra réguler la surfréquentation en proposant des itinéraires alternatifs dans les oasis voisines (Timimoun, Taghit, Djanet), protégeant ainsi le patrimoine fragile tout en maximisant les retombées économiques locales. Ce panneau illustre la mise en page du futur tableau de bord ; aucune donnée institutionnelle réelle n'y est exploitée.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[#b85631]/20 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#b85631] text-white font-semibold text-xs shadow hover:bg-[#964223] transition-colors"
          >
            Fermer les indicateurs
          </button>
        </div>
      </div>
    </div>
  );
}