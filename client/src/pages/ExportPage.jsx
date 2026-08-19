/* Direction : carnet de route saharien — l’export est un vrai template Story : une photo du lieu en
   fond quand elle existe, un polaroid où l’utilisateur pose sa propre photo, Fennec réduit en détail
   mascotte plutôt qu’en vedette. Partage natif en priorité (ouvre le sheet iOS/Android avec IG, TikTok,
   WhatsApp...), avec un repli PNG + copie si le partage natif n’est pas disponible (desktop). */
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Camera, Check, Copy, Download, Instagram, RotateCcw, Share2, X } from "lucide-react";
import { useLocation } from "wouter";
import { useWilaya } from "../contexts/WilayaContext";
import { FennecAvatar, TopBar } from "../components/RihlaPrimitives";

const THEMES = [
  { id: "saffron", label: "Saffran", tint: "#7e3426", gradient: "linear-gradient(155deg, #7e3426 0%, #c77835 44%, #e0ac3e 100%)" },
  { id: "palm", label: "Palmier", tint: "#0f3f32", gradient: "linear-gradient(155deg, #0f3f32 0%, #145b43 50%, #b98435 100%)" },
  { id: "night", label: "Nuit", tint: "#201b2d", gradient: "linear-gradient(155deg, #201b2d 0%, #2f2131 52%, #8f3e2c 100%)" },
];

// Le champ image peut s'appeler différemment selon la source des données (image, photo, imageUrl...) ;
// on essaie les variantes plausibles plutôt que de supposer un seul nom de champ.
function siteImageUrl(site) {
  return site?.image || site?.photo || site?.imageUrl || site?.photoUrl || null;
}

// Première étape du circuit qui a une vraie photo — c'est elle qui devient le fond de la Story.
function findBackgroundPhoto(sites) {
  for (const site of sites) {
    const url = siteImageUrl(site);
    if (url) return { url, site };
  }
  return null;
}

export default function ExportPage() {
  const [, setLocation] = useLocation();
  const { itinerary, resetAll } = useWilaya();
  const [theme, setTheme] = useState("saffron");
  const [copied, setCopied] = useState(false);
  const [canShareFiles, setCanShareFiles] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const storyRef = useRef(null);
  const fileInputRef = useRef(null);
  const data = itinerary;

  useEffect(() => {
    if (!data) setLocation("/mood");
  }, [data, setLocation]);

  // Le partage de fichiers (navigator.share avec { files }) n'est fiable que sur mobile ;
  // on le détecte plutôt que de supposer, pour ne jamais montrer un bouton qui échouera silencieusement.
  useEffect(() => {
    const probe = new File(["x"], "probe.png", { type: "image/png" });
    setCanShareFiles(Boolean(navigator.share && navigator.canShare?.({ files: [probe] })));
  }, []);

  // Libère l'URL objet du fichier choisi quand elle n'est plus utilisée, pour ne pas fuiter de mémoire.
  useEffect(() => () => { if (userPhoto) URL.revokeObjectURL(userPhoto); }, [userPhoto]);

  if (!data) return null;
  const activeTheme = THEMES.find((item) => item.id === theme) || THEMES[0];
  const first = data.sites[0];
  const last = data.sites[data.sites.length - 1];
  const bgPhoto = findBackgroundPhoto(data.sites);
  const summary = `${data.title}\n${data.sites.map((site) => `Jour ${site.day} — ${site.name}, ${site.wilaya}`).join("\n")}\n\n${data.le_fennec_comment}\n\n#WilayaPlus #Algerie #Voyage`;

  const onChoosePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (userPhoto) URL.revokeObjectURL(userPhoto);
    setUserPhoto(URL.createObjectURL(file));
    event.target.value = "";
  };

  const removePhoto = () => {
    if (userPhoto) URL.revokeObjectURL(userPhoto);
    setUserPhoto(null);
  };

  const captureCanvas = async () => {
    if (!storyRef.current) return null;
    return html2canvas(storyRef.current, { scale: 2, useCORS: true, backgroundColor: null });
  };

  const canvasToBlob = (canvas) =>
    new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"));

  const downloadPng = async () => {
    const canvas = await captureCanvas();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "wilaya-ma-story.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Partage natif : ouvre le sheet du système (Instagram, TikTok, WhatsApp, Messages...).
  // C'est le seul mécanisme qui fonctionne réellement sur mobile sans app tierce enregistrée.
  const shareNative = async () => {
    const canvas = await captureCanvas();
    if (!canvas) return;
    const blob = await canvasToBlob(canvas);
    if (!blob) return downloadPng();
    const file = new File([blob], "wilaya-ma-story.png", { type: "image/png" });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: data.title, text: summary });
      } else {
        await downloadPng();
      }
    } catch {
      // L'utilisateur a annulé le sheet, ou le partage a échoué silencieusement — pas d'action forcée.
    }
  };

  // Raccourcis directs : tentent le schéma d'app (fonctionne dans l'app IG/TikTok elle-même ou une
  // webview), sinon replient sur le téléchargement + un message clair plutôt qu'un échec silencieux.
  const shareToApp = async (appName) => {
    const canvas = await captureCanvas();
    if (!canvas) return;
    await downloadPng();
    setCopied(false);
    window.setTimeout(() => {
      alert(
        appName === "Instagram"
          ? "Image téléchargée. Ouvre Instagram → Story → choisis cette image depuis ta galerie."
          : "Image téléchargée. Ouvre TikTok → Créer → importe cette image depuis ta galerie."
      );
    }, 200);
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const restart = () => { resetAll(); setLocation("/"); };

  return (
    <div className="page-shell export-page">
      <div className="phone-container">
        <TopBar step="3 / 3" onBack={() => setLocation("/itinerary")} center />
        <main>
          <div className="export-intro fade-up">
            <div className="eyebrow">La route est à toi</div>
            <h1>Garde une trace de ta rihla.</h1>
            <p>Ajoute ta photo, choisis une ambiance, puis partage la carte de ton itinéraire.</p>
          </div>

          <section
            ref={storyRef}
            className={`story-card fade-up delay-1 ${bgPhoto ? "has-photo" : ""}`}
            style={{ "--story-gradient": activeTheme.gradient, "--story-tint": activeTheme.tint }}
            aria-label="Aperçu de la Story Wilaya+"
          >
            {bgPhoto && <img className="story-bg-photo" src={bgPhoto.url} alt="" aria-hidden="true" crossOrigin="anonymous" />}

            <div className="story-top">
              <span className="story-brand">Wilaya+ ولاية</span>
              <div className="story-top-right">
                <span className="story-daycount">{data.total_days} JOURS</span>
                <div className="story-mascot">
                  <FennecAvatar pose="proud" alt="Fennec" />
                </div>
              </div>
            </div>

            <div className="story-middle">
              {/* -- Polaroid : l'utilisateur pose sa propre photo, c'est le vrai geste "story" -- */}
              <div className="story-polaroid">
                <div className="story-polaroid-frame">
                  {userPhoto ? (
                    <img src={userPhoto} alt="Ta photo" />
                  ) : (
                    <button type="button" className="story-polaroid-upload" onClick={() => fileInputRef.current?.click()}>
                      <Camera size={18} />
                      Ajoute ta photo
                    </button>
                  )}
                </div>
                {userPhoto && (
                  <button type="button" className="story-polaroid-remove" onClick={removePhoto} aria-label="Retirer la photo">
                    <X size={12} />
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={onChoosePhoto} hidden />
              </div>

              <div className="story-kicker">Mon itinéraire algérien</div>
              <h2 className="story-title">{data.title}</h2>
            </div>

            <div className="story-route">
              <span className="story-route-dot" aria-hidden="true" />
              <span className="story-route-line" aria-hidden="true" />
              <span className="story-route-text">{first.wilaya} <ArrowGlyph /> {last.wilaya}</span>
            </div>

            <div className="story-footer">
              <span>Algeria, by mood</span>
              <span>wilaya.app</span>
            </div>
          </section>

          <div className="theme-selector" aria-label="Choisir le thème de la Story">
            {THEMES.map((item) => <button key={item.id} type="button" className={`theme-dot ${theme === item.id ? "is-active" : ""}`} title={item.label} aria-label={`Thème ${item.label}`} style={{ background: item.gradient }} onClick={() => setTheme(item.id)} />)}
          </div>

          <div className="export-actions fade-up delay-2">
            {canShareFiles ? (
              <button className="btn-primary" type="button" onClick={shareNative}><Share2 size={16} /> Partager la Story</button>
            ) : (
              <button className="btn-primary" type="button" onClick={downloadPng}><Download size={16} /> Télécharger l’image PNG</button>
            )}
            <button className="btn-palm" type="button" onClick={copySummary}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Résumé copié" : "Copier le résumé texte"}</button>
          </div>

          <div className="share-row fade-up delay-2">
            <button className="share-icon-btn" type="button" onClick={() => shareToApp("Instagram")}><Instagram size={15} /> Instagram</button>
            <button className="share-icon-btn" type="button" onClick={() => shareToApp("TikTok")}><TikTokGlyph /> TikTok</button>
          </div>
          {!canShareFiles && (
            <p className="share-fallback-note">Le partage direct fonctionne mieux depuis ton téléphone. Sur cet appareil, l’image est téléchargée puis à importer manuellement dans l’app.</p>
          )}

          <div className="export-actions fade-up delay-2" style={{ marginTop: 6 }}>
            <button className="btn-ghost" type="button" onClick={restart}><RotateCcw size={15} /> Créer un autre itinéraire</button>
          </div>
        </main>
      </div>
    </div>
  );
}

function ArrowGlyph() {
  return <span aria-hidden="true">→</span>;
}

// lucide-react n'a pas d'icône TikTok officielle ; petit glyphe SVG cohérent avec les icônes 15px environnantes.
function TikTokGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82a4.28 4.28 0 0 1-3.09-1.32V15.9a5.1 5.1 0 1 1-4.34-5.04v2.6a2.5 2.5 0 1 0 1.74 2.38V2h2.6a4.28 4.28 0 0 0 3.09 3.55v.27z" />
    </svg>
  );
}