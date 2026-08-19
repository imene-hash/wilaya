/* Dossier de candidature officiel - IA Tour Algérie 2026 */
import { useState } from "react";
import { CheckCircle2, Award, FileText, Download, ShieldCheck, Sparkles, X } from "lucide-react";

export default function ConcoursModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "Wilaya+ ولاية",
    axis: "Axe 02 : Sur-Mesure & IA Générative",
    type: "Startup / Porteur de projet",
    wilaya: "Alger & National (69 wilayas)",
    leadName: "Équipe Wilaya+ Algérie",
    email: "À renseigner par le porteur",
    ethicsChecked: true
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fffaf0] border border-[#b85631]/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 md:p-8 text-[#2b1f1a]">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f2e6d8] flex items-center justify-center text-[#7c3426] hover:bg-[#b85631] hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-[#d89a2b]/20 text-[#96630f] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> IA Tour Algérie 2026
          </span>
          <span className="text-xs text-[#7c3426]/70 font-mono">Ministère du Tourisme et de l'Artisanat</span>
        </div>




        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-xs uppercase tracking-wider mb-1 text-[#7c3426]">Nom du Projet</label>
                <input 
                  type="text" 
                  value={formData.projectName} 
                  onChange={e => setFormData({...formData, projectName: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-[#b85631]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b85631]"
                  required 
                />
              </div>
              <div>
                <label className="block font-semibold text-xs uppercase tracking-wider mb-1 text-[#7c3426]">Axe Stratégique</label>
                <select 
                  value={formData.axis}
                  onChange={e => setFormData({...formData, axis: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-[#b85631]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b85631]"
                >
                  <option>Axe 01 : Rêve (Immersion & Média)</option>
                  <option>Axe 02 : Sur-Mesure (IA & Personnalisation)</option>
                  <option>Axe 03 : Performance (Big Data & Optimisation)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-xs uppercase tracking-wider mb-1 text-[#7c3426]">Type de Candidature</label>
                <input 
                  type="text" 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-[#b85631]/30 rounded-lg" 
                />
              </div>
              <div>
                <label className="block font-semibold text-xs uppercase tracking-wider mb-1 text-[#7c3426]">Porteur / Wilaya</label>
                <input 
                  type="text" 
                  value={formData.wilaya} 
                  onChange={e => setFormData({...formData, wilaya: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-[#b85631]/30 rounded-lg" 
                />
              </div>
            </div>

            <div className="p-4 bg-white/70 rounded-xl border border-[#b85631]/20 space-y-2">
              <div className="font-semibold text-xs uppercase tracking-wider text-[#7c3426] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Article 10 — Éthique & Souveraineté des Données
              </div>
              <p className="text-xs text-[#2b1f1a]/80 leading-relaxed">
                Conforme à la Loi 18-07 sur la protection des données personnelles. Modèles ajustés pour refléter la diversité culturelle et religieuse algérienne, sans biais algorithmique.
              </p>
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.ethicsChecked} 
                  onChange={e => setFormData({...formData, ethicsChecked: e.target.checked})}
                  className="rounded text-[#b85631]" 
                />
                <span className="text-xs font-medium">Je certifie l’exactitude des informations et l’engagement éthique.</span>
              </label>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-end">
              <button 
                type="button" 
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-[#7c3426]/30 text-[#7c3426] font-semibold hover:bg-[#7c3426]/10 transition-colors"
              >
                Fermer
              </button>

            </div>
          </form>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="pt-4 flex justify-center gap-3">

              <button 
                onClick={onClose}
                className="px-6 py-2 text-xs font-semibold rounded-lg bg-[#b85631] text-white hover:bg-[#964223]"
              >
                Retourner à Wilaya+
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
