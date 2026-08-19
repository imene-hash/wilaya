/* Direction : carnet de route saharien — chaque donnée porte une couleur, une étape et une voix de compagnon. */

export const ASSETS = {
  mark: "/fennec-mark.jpg",
  heroVictory: "/fennec-hype.jpg",
  heroVictoryScene: "/fennec-hype-scene.jpg",
  heroCity: "/fennec-proud.jpg",
  heroCityScene: "/fennec-proud-scene.jpg",
  thinking: "/fennec-thinking.jpg",
  thinkingAlt: "/fennec-skeptic.jpg",
  reactions: "/fennec-shocked.jpg",
  storyFrame: "/manus-storage/rihla-story-frame_a6df927a.png",
};

export const MOODS = [
  { id: "desert", label: "Aventure du désert", labelAr: "مغامرة الصحراء", emoji: "◒", description: "Dunes, étoiles, Sahara infini", color: "#c77835" },
  { id: "history", label: "Histoire & architecture", labelAr: "التاريخ والعمارة", emoji: "⌂", description: "Casbah, ruines romaines, médinas", color: "#956a42" },
  { id: "chill", label: "Chill & côte", labelAr: "استرخاء والشاطئ", emoji: "≈", description: "Méditerranée, calanques, dolce vita", color: "#2b8e8b" },
  { id: "culture", label: "Culture & artisanat", labelAr: "ثقافة وحرف", emoji: "✦", description: "Marchés, poteries, musique locale", color: "#8d4961" },
];

export const BUDGETS = [
  { id: 1, label: "Petit budget", icon: "◌", hint: "On optimise chaque dinar" },
  { id: 2, label: "Moyen", icon: "◆", hint: "Le bon équilibre" },
  { id: 3, label: "Confort", icon: "✧", hint: "On se fait plaisir" },
];

export const MOCK_ITINERARY = {
  title: "Trésors d'artisanat & terroirs",
  total_days: 3,
  le_fennec_comment: "Tu vas repartir avec les valises pleines de tapis et d'épices. Prépare ton coffre.",
  le_fennec_pose: "proud",
  sites: [
    { id: 1, day: 1, name: "Ghardàïa & vallée du M'Zab", wilaya: "Ghardàïa", description: "Cités pentapoles millénaires, architecture d'avant-garde et tissage de tapis légendaire.", duration_hours: 7, budget_level: 1, tags: ["culture", "architecture"], cover_gradient: "linear-gradient(135deg, #8f3e2c, #d7963a)", icon: "⌂", tip: "Respecte les consignes de visite et les tenues traditionnelles.", le_fennec_tip: "Le partage des eaux ici a 1000 ans. Même ton smartphone est jaloux.", color: "#8f3e2c" },
    { id: 2, day: 2, name: "Tlemcen, cité des princes", wilaya: "Tlemcen", description: "Palais El Mechouar, mosquée almohade, cascades d'El Ourit et broderies de Chedda.", duration_hours: 6, budget_level: 1, tags: ["culture", "histoire"], cover_gradient: "linear-gradient(135deg, #145b43, #4e9b80)", icon: "✥", tip: "Visite les ateliers de poterie et les tisserands traditionnels de Mansourah.", le_fennec_tip: null, color: "#145b43" },
    { id: 3, day: 3, name: "Constantine, ville des ponts", wilaya: "Constantine", description: "Gorges du Rhummel vertigineuses et musique Malouf envoûtante.", duration_hours: 7, budget_level: 1, tags: ["culture", "patrimoine"], cover_gradient: "linear-gradient(135deg, #2f2131, #b85631)", icon: "⌁", tip: "Traverse la passerelle au coucher du soleil.", le_fennec_tip: "Si t'as le vertige, ferme les yeux et tiens mon sac.", color: "#2f2131" },
  ],
};

export const BUDGET_QUOTES = {
  1: "Ok, mode économie. On va se débrouiller inshallah, mais pas question de rater le coucher de soleil.",
  2: "Le juste milieu : assez de confort pour dormir, assez d'aventure pour raconter une vraie histoire.",
  3: "VIP treatment activé. Je réserve le meilleur thé à la menthe et une vue qui mérite une story.",
};

export const WELCOME_LINES = [
  "Wesh ! Tu veux découvrir l'Algérie vraiment ? Pas les trucs ennuyeux.",
  "Donne-moi ton mood. Je connais 58 wilayas et trois façons de négocier un bon thé.",
  "Une vraie rihla, ça commence par une envie. Le reste, je le trace.",
  "Promis, je ne te ferai pas visiter un endroit juste parce qu'il est dans un top 10.",
];

export const LOADING_MESSAGES = [
  "Consultation des meilleurs spots…",
  "Négociation avec les chameaux locaux…",
  "Vérification de la météo du désert…",
  "Fennec compte les wilayas…",
];

// Commentaires spécifiques quand l'itinéraire part d'un pin choisi sur la carte "Inspiration Immédiate"
// plutôt que du formulaire /mood. On garde une voix cohérente avec BUDGET_QUOTES / MOCK_ITINERARY.
const PRESET_REGION_COMMENTS = {
  "adrar-timimoun": "Timimoun, l'Oasis Rouge. J'ai gardé les foggaras et le meilleur coucher de soleil sur les dunes pour toi.",
  "alger-casbah": "La Casbah, mon terrain de jeu préféré. Ruelles, thé et vue sur la baie — je t'ai tracé le meilleur angle.",
  "illizi-tassili": "Tassili n'Ajjer. Peu de gens vont jusque-là, mais toi si. J'ai calé le rythme pour que tu tiennes la distance.",
  "oran-elbahia": "Oran, El Bahia. Corniche, Rai et Santa Cruz — j'ai gardé de la place pour flâner, pas juste cocher des cases.",
};

export function createItinerary({ mood, duration, budget, presetRegion }) {
  const moodData = MOODS.find((item) => item.id === mood) || MOODS[3];
  const baseSites = [...MOCK_ITINERARY.sites];
  const titleByMood = {
    desert: "Poussière d'or & nuits nomades",
    history: "Pierres anciennes, récits vivants",
    chill: "Bleu Méditerranée & pauses longues",
    culture: "Trésors d'artisanat & terroirs",
  };

  const presetComment = presetRegion && PRESET_REGION_COMMENTS[presetRegion.id];
  const fennecComment = presetComment
    || (budget === 3 ? "Confort activé. J'ai gardé les meilleurs points de vue, évidemment." : MOCK_ITINERARY.le_fennec_comment);

  return {
    ...MOCK_ITINERARY,
    title: presetRegion ? presetRegion.title : titleByMood[moodData.id],
    total_days: duration,
    le_fennec_comment: fennecComment,
    origin_region: presetRegion || null,
    sites: baseSites.map((site, index) => ({ ...site, day: index + 1 })),
  };
}