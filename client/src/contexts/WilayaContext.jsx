/* Direction : carnet de route saharien — l'état de l'app reste simple, réversible et narratif. */
import { createContext, useContext, useMemo, useState } from "react";
import { createItinerary } from "../lib/wilayaData";

const WilayaContext = createContext(null);

export function WilayaProvider({ children }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState(2);
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // presetRegion : renseigné quand l'utilisateur arrive depuis "Inspiration Immédiate"
  // (carte ou carte-postale) plutôt que depuis le formulaire /mood. Permet à Fennec de
  // dire pourquoi CETTE région a été choisie, et à LoadingPage de sauter directement à la génération.
  const [presetRegion, setPresetRegion] = useState(null);

  const value = useMemo(() => ({
    selectedMood,
    duration,
    budget,
    itinerary,
    isLoading,
    error,
    presetRegion,
    setMood: setSelectedMood,
    setDuration,
    setBudget,
    setItinerary,
    setLoading,
    setError,
    setPresetRegion,
    resetAll() {
      setSelectedMood(null);
      setDuration(3);
      setBudget(2);
      setItinerary(null);
      setLoading(false);
      setError(null);
      setPresetRegion(null);
    },
    buildMockItinerary() {
      const result = createItinerary({ mood: selectedMood, duration, budget, presetRegion });
      setItinerary(result);
      return result;
    },
  }), [selectedMood, duration, budget, itinerary, isLoading, error, presetRegion]);

  return <WilayaContext.Provider value={value}>{children}</WilayaContext.Provider>;
}

export function useWilaya() {
  const value = useContext(WilayaContext);
  if (!value) throw new Error("useWilaya doit être utilisé dans WilayaProvider");
  return value;
}