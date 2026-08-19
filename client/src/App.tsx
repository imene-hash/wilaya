/* Direction : carnet de route saharien — le routeur suit les pages du carnet, sans impasse et avec un retour clair. */
// @ts-nocheck
import { Redirect, Route, Switch } from "wouter";
import { WilayaProvider } from "./contexts/WilayaContext";
import IntroGate from "./components/IntroGate";
import ScrollToTop from "./components/ScrollToTop";
import WelcomePage from "./pages/WelcomePage";
import MoodPage from "./pages/MoodPage";
import LoadingPage from "./pages/LoadingPage";
import ItineraryPage from "./pages/ItineraryPage";
import ExportPage from "./pages/ExportPage";
import RevePage from "./pages/RevePage";
import PerformancePage from "./pages/PerformancePage";
import PassportPage from "./pages/PassportPage";
import CarteVivantePage from "./pages/CarteVivantePage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={WelcomePage} />
      <Route path="/mood" component={MoodPage} />
      <Route path="/loading" component={LoadingPage} />
      <Route path="/itinerary" component={ItineraryPage} />
      <Route path="/export" component={ExportPage} />
      <Route path="/reve" component={RevePage} />
      <Route path="/passeport" component={PassportPage} />
      <Route path="/carte-vivante" component={CarteVivantePage} />
      {/* Sur-Mesure, , Dossier, Kit : à venir, même patron que RevePage */}
      <Route><Redirect to="/" /></Route>
    </Switch>
  );
}

export default function App() {
  return (
    <WilayaProvider>
      <div className="wilaya-app">
        <ScrollToTop />
        <IntroGate>
          <Router />
        </IntroGate>
      </div>
    </WilayaProvider>
  );
}