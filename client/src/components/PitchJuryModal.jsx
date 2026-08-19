/* Mode  Jury — Présentation 90 secondes pour IA Tour Algérie 2026 */
import { useState, useEffect } from "react";
import { Sparkles, Award, Play, Pause, ChevronRight, ChevronLeft, X, CheckCircle2 } from "lucide-react";

const _STEPS = [
  {
    title: "1. Le Problème & Le Contexte",
    subtitle: "La richesse touristique de l’Algérie méritait une vitrine numérique à la hauteur.",
    content: "L'Algérie offre 69 wilayas de paysages époustouflants, du littoral turquoise aux oasis du Tassili. Pourtant, la planification d'un voyage authentique restait fragmentée et impersonnelle pour les voyageurs nationaux et internationaux.",
    metric: "69 wilayas · 3 axes stratégiques"
  },
  {
    title: "2. La Solution Wilaya+ & IA",
    subtitle: "Un carnet de route personnalisé guidé par Fennec, notre assistant fennec.",
    content: "Grâce aux axes Rêve (immersion NeRF), Sur-Mesure (génération d'itinéraires adaptés aux préférences et au budget) et Performance (pilotage des flux touristiques), Wilaya+ révolutionne l'accès au patrimoine algérien.",
    metric: "IA générative · Modélisation 3D · 0 biais"
  },
  {
    title: "3. Impact & Tourisme Durable",
    subtitle: "Protéger le patrimoine tout en dynamisant l'artisanat local.",
    content: "Wilaya+ intègre une redistribution intelligente des flux vers les oasis voisines pour éviter la surfréquentation, tout en valorisant les artisans locaux, les gîtes authentiques et les traditions ancestrales.",
    metric: "4.9/5 satisfaction · Éthique Loi 18-07"
  },
  {
    title: "4. Conclusion & Appel au Jury",
    subtitle: "Prêt pour la Grande Finale du 27 Septembre 2026.",
    content: "Avec un prototype entièrement fonctionnel, une identité visuelle unique et un alignement total sur les critères du Ministère du Tourisme et de l'Artisanat, Wilaya+ incarne l'excellence de la Tech algérienne.",
    metric: "1 000 000 DA · Grand Prix IA Tour"
  }
];

export default function JuryModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying && isOpen) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < _STEPS.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isOpen]);

  if (!isOpen) return null;

  const step = _STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#fffaf0] border-2 border-[#b85631]/40 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-[#2b1f1a] p-6 md:p-8">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f2e6d8] flex items-center justify-center text-[#7c3426] hover:bg-[#b85631] hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-[#d89a2b]/20 text-[#8a5b0b] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Mode  Jury (90s)
          </span>
          <span className="text-xs text-[#7c3426]/70 font-mono">Étape {currentStep + 1} sur {_STEPS.length}</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold font-['Outfit'] mb-1 text-[#2b1f1a]">
          {step.title}
        </h2>
        <p className="text-sm font-semibold text-[#b85631] mb-6">
          {step.subtitle}
        </p>

        {/* Progress bar */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {_STEPS.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full cursor-pointer transition-all ${idx <= currentStep ? 'bg-[#b85631]' : 'bg-[#e2d0c0]'}`}
            />
          ))}
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#b85631]/20 shadow-inner mb-6 space-y-4">
          <p className="text-base text-[#2b1f1a]/90 leading-relaxed font-['Outfit']">
            {step.content}
          </p>
          <div className="pt-2 flex items-center justify-between border-t border-[#f2e6d8]">
            <span className="text-xs font-bold text-[#b85631] uppercase tracking-wider">Métrique clé du </span>
            <span className="px-3 py-1 bg-[#f2e6d8] text-[#7c3426] rounded-full text-xs font-bold">{step.metric}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#b85631]/20">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl bg-[#b85631] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#964223] transition-colors shadow"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? "Pause du " : "Lecture automatique (5s/étape)"}
            </button>
          </div>

          <div className="flex gap-2">
            <button 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 rounded-xl bg-[#f2e6d8] text-[#7c3426] font-bold text-xs disabled:opacity-40 hover:bg-[#e6d3c2]"
            >
              <ChevronLeft className="w-4 h-4 inline" /> Précédent
            </button>
            <button 
              disabled={currentStep === _STEPS.length - 1}
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-4 py-2 rounded-xl bg-[#b85631] text-white font-bold text-xs disabled:opacity-40 hover:bg-[#964223]"
            >
              Suivant <ChevronRight className="w-4 h-4 inline" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
