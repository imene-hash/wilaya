/* Direction : carnet de route saharien — un interlude aubergine, comme une page de carnet plongée dans la nuit avant le départ. */
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { FennecAvatar } from "../components/RihlaPrimitives";
import { createItinerary, LOADING_MESSAGES } from "../lib/wilayaData";
import { useWilaya } from "../contexts/WilayaContext";

export default function LoadingPage() {
  const [, setLocation] = useLocation();
  const { selectedMood, duration, budget, presetRegion, setItinerary, setLoading, error, setError } = useWilaya();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const messageTimer = window.setInterval(() => setMessageIndex((current) => (current + 1) % LOADING_MESSAGES.length), 1500);

    // On garde un minimum de 2.3s même si l'API répond plus vite : Fennec a le
    // temps de raconter ses blagues, et le rythme visuel ne change pas.
    const minDelay = new Promise((resolve) => window.setTimeout(resolve, 2300));

    async function generate() {
      if (!selectedMood) throw new Error("Choisis d'abord une ambiance.");

      try {
        const response = await fetch("/api/generate-itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood: selectedMood, duration, budget, presetRegion }),
        });
        if (!response.ok) throw new Error(`API a répondu ${response.status}`);
        return await response.json();
      } catch (apiError) {
        // Le backend n'est pas joignable (dev sans serveur lancé, réseau coupé, etc.)
        // On reste démontrable en repassant sur le mock local plutôt que de planter.
        console.warn("Génération IA indisponible, fallback local :", apiError);
        return createItinerary({ mood: selectedMood, duration, budget, presetRegion });
      }
    }

    Promise.all([generate(), minDelay])
      .then(([result]) => {
        if (cancelled) return;
        setItinerary(result);
        setLoading(false);
        setLocation("/itinerary");
      })
      .catch((caught) => {
        if (cancelled) return;
        setError(caught.message || "La route s'est perdue dans le désert.");
        setLoading(false);
      });

    return () => { cancelled = true; window.clearInterval(messageTimer); };
  }, [selectedMood, duration, budget, presetRegion, setError, setItinerary, setLoading, setLocation]);

  const introLabel = presetRegion
    ? `Wilaya+ · Fennec prépare ${presetRegion.wilaya}`
    : "Wilaya+ · le tracé est en cours";

  return (
    <div className="loading-page">
      <div className="loading-inner fade-up">
        <FennecAvatar pose="thinking" className="loading-avatar" alt="Fennec réfléchit à ton itinéraire" />
        <div className="loading-route-label"><span>:) </span> {introLabel} <span>:) </span></div>
        <h1>On dessine ta route.</h1>
        {!error ? <>
          <p className="loading-message" aria-live="polite">{LOADING_MESSAGES[messageIndex]}</p>
          <div className="loading-dots" aria-label="Génération en cours"><i /><i /><i /></div>
        </> : <div className="error-inline"><p>{error}</p><button className="btn-primary mt-4" type="button" onClick={() => setLocation("/mood")}>Revenir au mood</button></div>}
      </div>
    </div>
  );
}