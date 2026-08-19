/* Kit de Candidature Automatique — Executive Summary & Business Case */
import { useState } from "react";
import { FileText, Download, Award, CheckCircle2, Sparkles, X } from "lucide-react";

export default function CandidateKitModal({ isOpen, onClose }) {
  const [downloaded, setDownloaded] = useState(false);

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
          <span className="px-3 py-1 bg-[#d89a2b]/20 text-[#8a5b0b] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Kit de Candidature Automatique
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold font-['Outfit'] mb-2 text-[#2b1f1a]">
          Executive Summary & Business Case 2026
        </h2>
        <p className="text-sm text-[#7c3426]/80 mb-6">
          Générez instantanément le dossier complet pour le Ministère du Tourisme et de l'Artisanat à partir de votre parcours.
        </p>

        <div className="space-y-4 mb-6 text-sm">
          <div className="p-4 rounded-2xl bg-white border border-[#b85631]/20 shadow-sm space-y-2">
            <h4 className="font-bold font-['Outfit'] text-base text-[#2b1f1a]">1. Executive Summary (3 pages max)</h4>
            <p className="text-xs text-[#2b1f1a]/80 leading-relaxed">
              Wilaya+ est la première plateforme d'IA générative dédiée au tourisme algérien. Elle associe personnalisation sur-mesure (Axe 2), immersion 3D/NeRF (Axe 1) et pilotage prédictif des flux (Axe 3).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#b85631]/20 shadow-sm space-y-2">
            <h4 className="font-bold font-['Outfit'] text-base text-[#2b1f1a]">2. Business Case & Viabilité Économique</h4>
            <p className="text-xs text-[#2b1f1a]/80 leading-relaxed">
              Modèle freemium avec commissions sur les réservations éthiques auprès des artisans locaux et des gîtes agréés. Impact direct sur l'attractivité des 69 wilayas et la valorisation du patrimoine authentique.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#f2e6d8]/60 border border-[#b85631]/20 flex items-center justify-between">
          <div>
            <h4 className="font-bold font-['Outfit'] text-sm text-[#2b1f1a]">Télécharger le dossier complet (.PDF)</h4>
            <p className="text-xs text-[#7c3426]/80">Prêt pour envoi à smart_tourisme@mta.gov.dz</p>
          </div>
          <button 
            onClick={() => setDownloaded(true)}
            className="px-5 py-2.5 rounded-xl bg-[#b85631] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#964223] transition-colors shadow"
          >
            <Download className="w-4 h-4" /> {downloaded ? "✓ Dossier téléchargé" : "Télécharger le dossier"}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-[#b85631]/20 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#b85631] text-white font-semibold text-xs shadow hover:bg-[#964223] transition-colors"
          >
            Fermer le kit
          </button>
        </div>
      </div>
    </div>
  );
}
