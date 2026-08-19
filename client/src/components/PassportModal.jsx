/* Passeport Numérique Wilaya+ & Tampons Sahariens */
import { useState } from "react";
import { Award, Compass, CheckCircle2, ShieldCheck, Sparkles, X } from "lucide-react";

const STAMPS = [
  { id: 1, wilaya: "Alger", title: "Casbah Millénaire", icon: "🏛️", unlocked: true, desc: "Visite guidée éthique des ruelles ottomans." },
  { id: 2, wilaya: "Adrar", title: "Oasis de Timimoun", icon: "🏜️", unlocked: true, desc: "Immersion foggaras et architecture en pisé." },
  { id: 3, wilaya: "Illizi", title: "Tassili n'Ajjer", icon: "⭐", unlocked: false, desc: "Randonnée rupestre avec guide local agréé." },
  { id: 4, wilaya: "Ghardaïa", title: "Vallée du M'Zab", icon: "🕌", unlocked: false, desc: "Découverte du patrimoine mozabite classé." },
  { id: 5, wilaya: "Oran", title: "Corniche Oranaise", icon: "🌊", unlocked: false, desc: "Patrimoine musical Rai et front de mer." },
];

export default function PassportModal({ isOpen, onClose }) {
  const [stamps, setStamps] = useState(STAMPS);
  const [missionDone, setMissionDone] = useState(false);

  if (!isOpen) return null;

  const toggleStamp = (id) => {
    setStamps(stamps.map(s => s.id === id ? { ...s, unlocked: !s.unlocked } : s));
  };

  const unlockedCount = stamps.filter(s => s.unlocked).length;

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
          <span className="px-3 py-1 bg-[#d89a2b]/20 text-[#8a5b0b] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Passeport Numérique du Voyageur
          </span>
          <span className="text-xs text-[#7c3426]/70 font-mono">{unlockedCount} / {stamps.length} tampons débloqués</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold font-['Outfit'] mb-2 text-[#2b1f1a]">
          Ton Carnet de Tampons Sahariens
        </h2>
        <p className="text-sm text-[#7c3426]/80 mb-6">
          Chaque étape validée dans ton itinéraire enrichit ton passeport numérique et soutient l'artisanat local.
        </p>

        {/* Stamp Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {stamps.map(stamp => (
            <div 
              key={stamp.id}
              onClick={() => toggleStamp(stamp.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${stamp.unlocked ? 'bg-white border-[#b85631] shadow-md' : 'bg-[#f2e6d8]/50 border-dashed border-[#b85631]/30 opacity-70'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stamp.icon}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stamp.unlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                  {stamp.unlocked ? 'Débloqué' : 'À visiter'}
                </span>
              </div>
              <h4 className="font-bold font-['Outfit'] text-sm text-[#2b1f1a]">{stamp.title}</h4>
              <p className="text-[11px] text-[#7c3426]/80 mt-1 leading-tight">{stamp.desc}</p>
            </div>
          ))}
        </div>

        {/* Responsible Mission */}
        <div className="p-5 rounded-2xl bg-[#f2e6d8]/60 border border-[#b85631]/20 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold font-['Outfit'] text-base text-[#2b1f1a] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" /> Mission Solidaire & Responsable du Jour
            </h4>
            <span className="text-xs font-semibold text-[#7c3426]">+50 points Wilaya+</span>
          </div>
          <p className="text-xs text-[#2b1f1a]/80 leading-relaxed">
            « Aujourd'hui, achète un produit d'artisanat local directement auprès d'un tisserand de la coopérative locale sans intermédiaire. »
          </p>
          <div className="pt-2 flex items-center justify-between">
            <button 
              onClick={() => setMissionDone(!missionDone)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${missionDone ? 'bg-emerald-700 text-white' : 'bg-[#b85631] text-white hover:bg-[#964223]'}`}
            >
              {missionDone ? "✓ Mission validée avec succès !" : "Valider ma mission solidaire"}
            </button>
            <span className="text-[11px] text-[#7c3426]/70 italic">Impact direct sur l'économie locale</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#b85631]/20 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#b85631] text-white font-semibold text-xs shadow hover:bg-[#964223] transition-colors"
          >
            Fermer le passeport
          </button>
        </div>
      </div>
    </div>
  );
}
