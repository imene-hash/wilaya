/* Direction : carnet de route saharien — chaque nouvelle page du carnet s'ouvre sur sa première ligne,
   jamais au milieu d'un paragraphe. Wouter, comme la plupart des routeurs SPA, ne réinitialise pas le
   scroll entre les pages : si on clique un lien alors qu'on est descendu dans la page courante, la page
   suivante s'affiche au même offset de scroll au lieu de démarrer en haut. Ce composant corrige ça
   globalement, une seule fois, pour toutes les routes présentes et futures. */
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // "auto" (pas "smooth") : un changement de page doit être instantané, pas animé.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  return null;
}