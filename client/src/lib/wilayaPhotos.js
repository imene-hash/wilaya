/* Direction : carnet de route saharien — même exigence de vérité que RevePage.jsx :
   on ne référence une photo que si le fichier est confirmé présent dans public/wilayas/.

   Statut au 18 août 2026 : 15 photos réelles confirmées dans public/wilayas/, dont 7 avec
   un nom de fichier complet et sans ambiguïté, et 8 dont le nom affiché dans l'explorateur
   de fichiers était tronqué ("...") au moment de la construction de cette page — impossible
   de deviner le suffixe exact sans risquer un <img> cassé en pleine soutenance devant le jury.
   Ces 8 sont documentées ci-dessous avec le préfixe confirmé et un TODO explicite : ouvrez
   public/wilayas/, copiez le nom de fichier exact, et complétez PHOTO_MAP. Tant que ce n'est
   pas fait, photoForWilaya() renvoie null pour ces wilayas et les composants appelants
   (ItineraryStagePanel, ItineraryThumb) retombent proprement sur leur plaque gravée SVG —
   jamais une image cassée, jamais un placeholder générique.

   Les clés sont les noms de wilaya tels qu'utilisés ailleurs dans l'app (wilayaData.js,
   MOCK_ITINERARY, etc.) — comparaison insensible à la casse et aux accents via normalize(). */

const PHOTO_MAP = {
  "adrar": "/wilayas/adrar-timimoun.jpg",
  "alger": "/wilayas/alger-la-casbah.jpg",
  "batna": "/wilayas/batna-timgad.jpg",
  "bechar": "/wilayas/bechar-beni-abbes.jpg",
  "illizi": "/wilayas/illizi-tassili-najjer.jpg",
  "oran": "/wilayas/oran-el-bahia.jpg",
  "setif": "/wilayas/setif-djemila.jpg",

  // TODO — nom de fichier tronqué dans l'explorateur au moment de la construction de cette
  // page (ex. "annaba-cap-de-gard...jpg"). Ouvrez public/wilayas/, copiez le nom exact du
  // fichier, et remplacez la valeur ci-dessous. Laissé à `null` pour ne jamais afficher un
  // chemin d'image inventé.
  "annaba": null, // préfixe confirmé : annaba-cap-de-gard...
  "bejaia": null, // préfixe confirmé : bejaia-parc-de-goura...
  "constantine": null, // préfixe confirmé : constantine-la-ville-d...
  "ghardaia": null, // préfixe confirmé : ghardaia-vallee-du-...
  "jijel": null, // préfixe confirmé : jjel-plages-de-beni-... (orthographe du fichier à vérifier : "jjel" vs "jijel")
  "tipaza": null, // préfixe confirmé : tipaza-ruines-punique...
  "tizi ouzou": null, // préfixe confirmé : tizi-ouzou-villages-ka...
  "tlemcen": null, // préfixe confirmé : tlemcen-cite-des-pri...
};

function normalize(value) {
  return (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Renvoie l'URL de la photo réelle pour une wilaya donnée, ou `null` si aucune photo
 * confirmée n'existe pour elle. Ne renvoie jamais un chemin non vérifié.
 * @param {string} wilayaName
 * @returns {string | null}
 */
export function photoForWilaya(wilayaName) {
  const key = normalize(wilayaName);
  if (!key) return null;

  if (PHOTO_MAP[key]) return PHOTO_MAP[key];

  // Correspondance partielle pour les libellés composés ("Ghardaïa & vallée du M'Zab",
  // "Adrar (Timimoun)", etc.) : on cherche si l'une des clés connues est contenue dans le
  // libellé fourni, dans les deux sens.
  const match = Object.keys(PHOTO_MAP).find((mapKey) => key.includes(mapKey) || mapKey.includes(key));
  return match ? PHOTO_MAP[match] : null;
}

/** Liste des wilayas avec une photo réelle confirmée — utile pour les pages qui doivent
 *  afficher un compte honnête ("15 wilayas documentées") plutôt qu'un chiffre optimiste. */
export function wilayasWithConfirmedPhoto() {
  return Object.keys(PHOTO_MAP).filter((key) => PHOTO_MAP[key] !== null);
}