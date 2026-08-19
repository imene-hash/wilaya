/* Direction : lattice nocturne algérois — géométrie de zellige et bijou berbère sur fond de nuit indigo.
   Fennec devient un compagnon fixe en marge, pas une illustration qui défile avec la page. */
import { useLocation } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useWilaya } from "../contexts/WilayaContext";
import { BUDGET_QUOTES, MOODS, BUDGETS } from "../lib/wilayaData";
import { FennecAvatar } from "../components/RihlaPrimitives";
import "../mood-v2.css";

export default function MoodPage() {
  const [, setLocation] = useLocation();
  const { selectedMood, duration, budget, setMood, setDuration, setBudget } = useWilaya();
  const selectedMoodData = MOODS.find((mood) => mood.id === selectedMood);

  return (
    <div className="mood-v2">
      <div className="mv2-topbar">
        <button type="button" className="mv2-back" onClick={() => setLocation("/")}>
          <ArrowLeft size={15} /> Retour
        </button>
        <span className="mv2-step">01 — Configuration</span>
      </div>

      <div className="mv2-shell">
        {/* Rail compagnon : Fennec reste fixe, il ne défile pas avec le formulaire */}
        <aside className="mv2-companion">
          <div className="mv2-companion-card">
            <FennecAvatar
              pose={budget === 3 ? "proud" : budget === 1 ? "skeptic" : "hype"}
              alt="Fennec réagit à tes choix"
              className="mv2-fennec-img"
            />
            <div className="mv2-companion-tag">Avis de Fennec</div>
            <p className="mv2-companion-quote">« {BUDGET_QUOTES[budget]} »</p>
          </div>
        </aside>

        <main className="mv2-form">
          <header className="mv2-hero">
            <span className="mv2-eyebrow">On part de ton mood</span>
            <h1 className="mv2-title">Choisis ta direction.</h1>
            <p className="mv2-lede">Trois réglages, une route qui te ressemble. Fennec ajuste le reste.</p>
          </header>

          <section className="mv2-section">
            <div className="mv2-section-head">
              <h2>Ambiance du voyage</h2>
              {selectedMoodData && <span className="mv2-picked">{selectedMoodData.label} sélectionné</span>}
            </div>
            <div className="mv2-mood-grid">
              {MOODS.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  className={`mv2-mood-tile ${selectedMood === mood.id ? "is-selected" : ""}`}
                  style={{ "--tile-color": mood.color }}
                  onClick={() => setMood(mood.id)}
                  aria-pressed={selectedMood === mood.id}
                >
                  <span className="mv2-tile-emoji" aria-hidden="true">{mood.emoji}</span>
                  <span className="mv2-tile-ar">{mood.labelAr}</span>
                  <strong className="mv2-tile-label">{mood.label}</strong>
                  <span className="mv2-tile-desc">{mood.description}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mv2-section">
            <div className="mv2-section-head">
              <h2>Durée du séjour</h2>
              <span className="mv2-picked mv2-picked-amber">{duration} jour{duration > 1 ? "s" : ""}</span>
            </div>
            <input
              className="mv2-slider"
              type="range"
              min="1"
              max="10"
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
              aria-label="Durée du séjour"
              style={{ "--fill": `${((duration - 1) / 9) * 100}%` }}
            />
            <div className="mv2-slider-labels">
              <span>1 jour</span>
              <span>long week-end</span>
              <span>10 jours</span>
            </div>
          </section>

          <section className="mv2-section">
            <div className="mv2-section-head">
              <h2>Niveau de budget</h2>
              <span className="mv2-picked">Tu gardes la main</span>
            </div>
            <div className="mv2-budget-row">
              {BUDGETS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`mv2-budget-tile ${budget === item.id ? "is-selected" : ""}`}
                  onClick={() => setBudget(item.id)}
                  aria-pressed={budget === item.id}
                >
                  <span className="mv2-budget-icon">{item.icon}</span>
                  <span className="mv2-budget-label">{item.label}</span>
                  <span className="mv2-budget-hint">{item.hint}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="mv2-actions">
            <button
              type="button"
              className="mv2-cta"
              disabled={!selectedMood}
              onClick={() => setLocation("/loading")}
            >
              Générer mon itinéraire <ArrowRight size={17} />
            </button>
            <p className="mv2-caption">Itinéraire calculé pour {duration} jour{duration > 1 ? "s" : ""} en Algérie.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
