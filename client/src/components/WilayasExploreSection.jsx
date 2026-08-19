/* Direction : carnet de route saharien — l'inspiration immédiate devient une carte vivante :
   Fennec est planté aux quatre coins du pays, et "Découvrir" lance une vraie route générée, pas une promesse. */
import { useState } from "react";
import { Compass, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import WilayaMap from "./WilayaMap";
import { useWilaya } from "../contexts/WilayaContext";

// Coordonnées réelles (centre-ville / site phare, vérifiées) — pas de placeholders.
// Chaque entrée porte un fait vérifiable (date, classement UNESCO...) pour rester cohérent
// avec la démarche "honnête, sourcée" déjà adoptée sur RevePage.jsx.
const FEATURED_REGIONS = [
  // — Sahara & Aventure —
  {
    id: "adrar-timimoun",
    wilaya: "Adrar — Timimoun",
    title: "L'Oasis Rouge et ses Foggaras",
    desc: "Un labyrinthe de dunes de sable ocre, d'architecture en pisé et d'oasis millénaires irriguées par un système de galeries souterraines (foggaras) toujours en usage.",
    vibe: "Sahara & Aventure",
    duration: "7 jours",
    mood: "desert",
    lat: 29.2639,
    lng: 0.2408,
    image: "/wilayas/adrar-timimoun.jpg",
  },
  {
    id: "illizi-tassili",
    wilaya: "Illizi — Tassili n'Ajjer",
    title: "Le Musée à Ciel Ouvert",
    desc: "Parc national classé UNESCO en 1982, célèbre pour ses milliers de peintures et gravures rupestres préhistoriques et ses formations de grès érodées uniques au monde.",
    vibe: "Grand Sud & Mystère",
    duration: "9 jours",
    mood: "desert",
    lat: 25.5228,
    lng: 8.4649,
    image: "/wilayas/illizi-tassili-najjer.jpg",
  },
  {
    id: "ghardaia-mzab",
    wilaya: "Ghardaïa — Vallée du M'Zab",
    title: "La Pentapole du Désert",
    desc: "Cinq cités fortifiées ibadites bâties entre le Xe et le XIe siècle, classées UNESCO en 1982. L'architecture mozabite a directement inspiré Le Corbusier.",
    vibe: "Sahara & Architecture",
    duration: "5 jours",
    mood: "desert",
    lat: 32.4900,
    lng: 3.6731,
    image: "/wilayas/ghardaia-vallee-du-mzab.jpg",
  },
  {
    id: "bechar-beniabbes",
    wilaya: "Béchar — Béni Abbès",
    title: "La Porte du Grand Erg",
    desc: "Oasis saharienne au bord de l'Erg Occidental, palmeraie en contrebas des dunes et ancien poste du Père de Foucauld au début du XXe siècle.",
    vibe: "Sahara & Aventure",
    duration: "6 jours",
    mood: "desert",
    lat: 31.6167,
    lng: -2.1667,
    image: "/wilayas/bechar-beni-abbes.jpg",
  },

  // — Culture & Histoire —
  {
    id: "alger-casbah",
    wilaya: "Alger — La Capitale",
    title: "La Casbah Ottomane & Front de Mer",
    desc: "Médina ottomane classée UNESCO en 1992, rues escarpées, palais suspendus et art de vivre méditerranéen face à la baie d'Alger.",
    vibe: "Culture & Histoire",
    duration: "3 jours",
    mood: "history",
    lat: 36.7850,
    lng: 3.0603,
    image: "/wilayas/alger-la-casbah.jpg",
  },
  {
    id: "batna-timgad",
    wilaya: "Batna — Timgad",
    title: "La Pompéi Africaine",
    desc: "Cité romaine fondée en l'an 100 par l'empereur Trajan, classée UNESCO en 1982. Plan en damier parfait, arc de Trajan et théâtre de 4000 places.",
    vibe: "Culture & Histoire",
    duration: "2 jours",
    mood: "history",
    lat: 35.4842,
    lng: 6.4686,
    image: "/wilayas/batna-timgad.jpg",
  },
  {
    id: "tipaza-ruines",
    wilaya: "Tipaza — Ruines antiques",
    title: "Entre Ruines et Méditerranée",
    desc: "Comptoir phénicien puis cité romaine, classé UNESCO en 1982. Théâtre, thermes et nécropoles se mêlent aux pins face à la mer — immortalisé par Camus dans « Noces ».",
    vibe: "Culture & Histoire",
    duration: "2 jours",
    mood: "history",
    lat: 36.5936,
    lng: 2.4481,
    image: "/wilayas/tipaza-ruines-puniques.jpg",
  },
  {
    id: "constantine-ponts",
    wilaya: "Constantine — Ville des Ponts",
    title: "La Cité des Gorges",
    desc: "Ville perchée au-dessus des gorges vertigineuses du Rhummel, reliée par des ponts suspendus spectaculaires et berceau de la musique Malouf.",
    vibe: "Culture & Histoire",
    duration: "3 jours",
    mood: "history",
    lat: 36.3650,
    lng: 6.6147,
    image: "/wilayas/constantine-la-ville-des-ponts.jpg",
  },
  {
    id: "tlemcen-princes",
    wilaya: "Tlemcen — Cité des Princes",
    title: "Palais, Mosquées et Cascades",
    desc: "Ancienne capitale des Zianides, mosquée almohade du XIIe siècle, palais El Mechouar et cascades d'El Ourit à quelques kilomètres du centre.",
    vibe: "Culture & Histoire",
    duration: "3 jours",
    mood: "history",
    lat: 34.8828,
    lng: -1.3167,
    image: "/wilayas/tlemcen-cite-des-princes-zianides.jpg",
  },
  {
    id: "setif-djemila",
    wilaya: "Sétif — Djémila",
    title: "Cuicul, la Cité des Mosaïques",
    desc: "Site romain classé UNESCO, bâti sur un éperon rocheux à 900 m d'altitude. Théâtre, forums et mosaïques comptent parmi les mieux conservés d'Afrique du Nord.",
    vibe: "Culture & Histoire",
    duration: "2 jours",
    mood: "history",
    lat: 36.3167,
    lng: 5.7333,
    image: "/wilayas/setif-djemila.jpg",
  },

  // — Chill & Côte —
  {
    id: "oran-elbahia",
    wilaya: "Oran — El Bahia",
    title: "La perle de la Méditerranée",
    desc: "Fort Santa Cruz surplombant la baie, berceau historique de la musique Raï et corniches baignées de soleil.",
    vibe: "Détente & Musique",
    duration: "4 jours",
    mood: "chill",
    lat: 35.6969,
    lng: -0.6331,
    image: "/wilayas/oran-el-bahia.jpg",
  },
  {
    id: "jijel-plages",
    wilaya: "Jijel — Corniche",
    title: "Le Littoral aux Eaux Turquoise",
    desc: "Plages de Beni Belaid et calanques de Ziama Mansouriah : une côte moins fréquentée qu'Alger ou Oran, entre Béjaïa et Skikda.",
    vibe: "Détente & Nature",
    duration: "4 jours",
    mood: "chill",
    lat: 36.8206,
    lng: 5.7664,
    image: "/wilayas/jijel-plages-de-beni-belaid.jpg",
  },
  {
    id: "bejaia-gouraya",
    wilaya: "Béjaïa — Gouraya",
    title: "Entre Mer et Montagne Kabyle",
    desc: "Parc national de Gouraya surplombant la baie, cascades de Kefrida et casbah historique perchée sur la corniche.",
    vibe: "Détente & Nature",
    duration: "4 jours",
    mood: "chill",
    lat: 36.7509,
    lng: 5.0844,
    image: "/wilayas/bejaia-parc-de-gouraya.jpg",
  },
  {
    id: "annaba-basilique",
    wilaya: "Annaba — Cap de Garde",
    title: "Ville Antique face au Golfe",
    desc: "Basilique Saint-Augustin dominant les ruines d'Hippone, plages du Cap de Garde et front de mer animé à l'extrême est du littoral.",
    vibe: "Détente & Histoire",
    duration: "3 jours",
    mood: "chill",
    lat: 36.9000,
    lng: 7.7667,
    image: "/wilayas/annaba-cap-de-garde.jpg",
  },

  // — Culture & Artisanat —
  {
    id: "tiziouzou-kabylie",
    wilaya: "Tizi Ouzou — Kabylie",
    title: "Villages Perchés & Artisanat",
    desc: "Villages berbères de montagne, poterie traditionnelle et bijoux d'argent, à proximité du lac noir niché dans la forêt d'Akfadou.",
    vibe: "Culture & Artisanat",
    duration: "5 jours",
    mood: "culture",
    lat: 36.7169,
    lng: 4.0497,
    image: "/wilayas/tizi-ouzou-villages-kabyles.jpg",
  },
];

// Filtres d'ambiance pour garder la grille lisible malgré 16 destinations —
// mêmes id que MOODS dans wilayaData.js, pour rester cohérent avec /mood.
const MOOD_FILTERS = [
  { id: "all", label: "Toutes" },
  { id: "desert", label: "Sahara & Aventure" },
  { id: "history", label: "Culture & Histoire" },
  { id: "chill", label: "Détente & Côte" },
  { id: "culture", label: "Culture & Artisanat" },
];

const INITIAL_VISIBLE = 8;

export default function WilayasExploreSection() {
  const [, setLocation] = useLocation();
  const { setMood, setDuration, setPresetRegion } = useWilaya();
  const [activeId, setActiveId] = useState(null);
  const [moodFilter, setMoodFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const launchRegion = (region) => {
    // On pré-remplit l'intention : mood déduit de la région, durée suggérée, et le nom
    // de la région pour que Fennec commente pourquoi il l'a choisie à l'arrivée.
    setMood(region.mood);
    const days = parseInt(region.duration, 10);
    if (!Number.isNaN(days)) setDuration(Math.min(10, Math.max(1, days)));
    setPresetRegion({ id: region.id, wilaya: region.wilaya, title: region.title });
    setLocation("/loading");
  };

  const filteredRegions = moodFilter === "all"
    ? FEATURED_REGIONS
    : FEATURED_REGIONS.filter((region) => region.mood === moodFilter);
  const visibleRegions = showAll ? filteredRegions : filteredRegions.slice(0, INITIAL_VISIBLE);
  const hiddenCount = filteredRegions.length - visibleRegions.length;

  return (
    <div className="w-full py-10 px-4 md:px-8 max-w-7xl mx-auto explore-section">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <span className="text-xs font-bold text-[#b85631] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Compass className="w-4 h-4" /> Inspiration Immédiate
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-['Outfit'] text-[#2b1f1a]">
            Explorez les plus beaux circuits d'Algérie
          </h2>
          <p className="text-xs text-[#7c3426]/70 mt-1.5 max-w-md">
            Fennec est planté sur la carte. Clique sur lui — ou sur une carte ci-dessous — pour ouvrir un itinéraire déjà prêt.
          </p>
        </div>
        <button
          onClick={() => setLocation("/mood")}
          className="px-5 py-2.5 bg-[#b85631] text-white rounded-xl text-xs font-bold hover:bg-[#964223] transition-colors flex items-center gap-2 self-start shadow"
        >
          Créer mon itinéraire sur-mesure <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <WilayaMap
        regions={filteredRegions}
        activeId={activeId}
        onSelect={setActiveId}
        onDiscover={launchRegion}
        isFiltered={moodFilter !== "all"}
      />

      <div className="flex flex-wrap gap-2 mt-6 mb-1" role="tablist" aria-label="Filtrer par ambiance">
        {MOOD_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={moodFilter === filter.id}
            onClick={() => { setMoodFilter(filter.id); setShowAll(false); setActiveId(null); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              moodFilter === filter.id
                ? "bg-[#b85631] border-[#b85631] text-white"
                : "bg-white border-[#b85631]/25 text-[#7c3426] hover:bg-[#f2e6d8]"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {visibleRegions.map((region) => (
          <div
            key={region.id}
            onClick={() => launchRegion(region)}
            className={`group bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col ${
              activeId === region.id ? "border-[#b85631] ring-2 ring-[#b85631]/25" : "border-[#b85631]/20"
            }`}
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src={region.image}
                alt={region.title}
                loading="eager"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#2b1f1a]/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                {region.wilaya}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-[#b85631] block mb-1">{region.vibe}</span>
                <h3 className="font-bold font-['Outfit'] text-base text-[#2b1f1a] leading-snug">{region.title}</h3>
                <p className="text-xs text-[#2b1f1a]/70 mt-1 line-clamp-2">{region.desc}</p>
              </div>
              <div className="pt-3 border-t border-[#f2e6d8] flex items-center justify-between text-xs font-semibold text-[#7c3426]">
                <span>⏱ {region.duration}</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); launchRegion(region); }}
                  className="flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  Découvrir <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hiddenCount > 0 && (
        <div className="flex justify-center mt-7">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="px-5 py-2.5 rounded-xl border border-[#b85631]/30 text-[#7c3426] text-xs font-bold hover:bg-[#f2e6d8] transition-colors"
          >
            Voir {hiddenCount} destination{hiddenCount > 1 ? "s" : ""} de plus
          </button>
        </div>
      )}
    </div>
  );
}