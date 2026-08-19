/* Direction : carnet de route saharien — un vrai passeport, pas une grille de badges.
   IMPORTANT (honnêteté, même principe que RevePage.jsx) : "Passeport & Tampons" n'est PAS
   l'un des trois axes thématiques du concours (Article 2 : Rêve / Sur-Mesure / Performance).
   C'est une fonctionnalité produit de Wilaya+ qui sert l'objectif transversal de l'Article 1
   ("moderniser l'expérience des touristes"). Cette page ne prétend donc jamais être un axe
   numéroté du règlement — elle est présentée pour ce qu'elle est.

   Seules les wilayas avec une photo réelle confirmée (voir wilayaPhotos.js, 7 aujourd'hui
   sur les 15 documentées faute de noms de fichiers non-tronqués — voir ce fichier pour le
   détail) peuvent recevoir un tampon avec image. Les autres wilayas du panel restent
   sélectionnables mais affichent un tampon typographique (nom + date), jamais une image
   inventée ou un chemin cassé. */
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Info, MapPin, RotateCcw, Sparkles, Stamp as StampIcon } from "lucide-react";
import { SiteNav, TopBar } from "../components/RihlaPrimitives";
import { photoForWilaya, wilayasWithConfirmedPhoto } from "../lib/wilayaPhotos";

const PASSPORT_WILAYAS = [
  { id: "adrar", name: "Adrar", region: "Sud — Timimoun", tag: "Oasis rouge" },
  { id: "alger", name: "Alger", region: "Nord", tag: "Casbah" },
  { id: "batna", name: "Batna", region: "Hauts Plateaux — Timgad", tag: "Cité romaine" },
  { id: "bechar", name: "Béchar", region: "Sud-Ouest — Béni Abbès", tag: "Portes du Sahara" },
  { id: "illizi", name: "Illizi", region: "Sud — Tassili n'Ajjer", tag: "Art rupestre" },
  { id: "oran", name: "Oran", region: "Ouest", tag: "El Bahia" },
  { id: "setif", name: "Sétif", region: "Hauts Plateaux — Djémila", tag: "Ruines romaines" },
  { id: "annaba", name: "Annaba", region: "Nord-Est — Cap de Garde", tag: "Côte" },
  { id: "bejaia", name: "Béjaïa", region: "Kabylie — Parc de Gouraya", tag: "Montagne & mer" },
  { id: "constantine", name: "Constantine", region: "Nord-Est", tag: "Ville des ponts" },
  { id: "ghardaia", name: "Ghardaïa", region: "M'Zab", tag: "Pentapole ibadite" },
  { id: "jijel", name: "Jijel", region: "Nord — plages", tag: "Béni Bélaïd" },
  { id: "tipaza", name: "Tipasa", region: "Nord — ruines puniques", tag: "Site UNESCO" },
  { id: "tizi ouzou", name: "Tizi Ouzou", region: "Kabylie", tag: "Villages perchés" },
  { id: "tlemcen", name: "Tlemcen", region: "Ouest", tag: "Cité des princes" },
];

const STAMP_ROTATIONS = [-9, 6, -4, 11, -13, 3, -6, 8, -3, 12, -8, 5, -11, 7, -5];

function todayStamp() {
  return new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function PassportPage() {
  const [, setLocation] = useLocation();
  const [stamped, setStamped] = useState(() => new Set());
  const [lastStampedId, setLastStampedId] = useState(null);

  const confirmedPhotoIds = useMemo(() => new Set(wilayasWithConfirmedPhoto()), []);
  const stampDate = useMemo(() => todayStamp(), []);

  function toggleStamp(id) {
    setStamped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        setLastStampedId(id);
      }
      return next;
    });
  }

  function resetPassport() {
    setStamped(new Set());
    setLastStampedId(null);
  }

  const stampedCount = stamped.size;
  const totalCount = PASSPORT_WILAYAS.length;

  return (
    <div className="page-shell passport-page">
      <SiteNav />
      <div className="page-container">
        <TopBar onBack={() => setLocation("/")} />

        <section className="feature-hero fade-up passport-hero">
          <div className="passport-kicker">
            <StampIcon size={13} /> Fonctionnalité Wilaya+
          </div>
          <h1 className="section-title">Un passeport qu'on remplit vraiment, pas une liste qu'on coche.</h1>
          <p className="section-copy">
            Chaque wilaya visitée devient un tampon à l'encre, posé à la main dans un carnet qui ressemble à un
            vrai document de voyage. Le geste — cliquer, entendre l'encre claquer, voir le tampon se poser de
            travers comme un vrai tampon — est délibérément tactile : c'est ce qui rend une collection satisfaisante.
          </p>
          <span className="passport-honesty-badge">
            <Info size={12} /> {confirmedPhotoIds.size} wilayas avec photo réelle confirmée sur {totalCount} du panel — les autres reçoivent un tampon typographique, jamais une image inventée
          </span>
        </section>

        <section className="passport-book-section fade-up delay-1">
          <div className="passport-book">
            <div className="passport-book-header">
              <div className="passport-book-title">
                <span className="font-arabic passport-book-title-ar">جواز السفر</span>
                <span className="passport-book-title-latin">Passeport du Voyageur · Wilaya+</span>
              </div>
              <div className="passport-progress">
                <span className="passport-progress-count">{stampedCount}<small>/{totalCount}</small></span>
                <div className="passport-progress-bar">
                  <div className="passport-progress-fill" style={{ width: `${(stampedCount / totalCount) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="passport-grid">
              {PASSPORT_WILAYAS.map((wilaya, index) => {
                const isStamped = stamped.has(wilaya.id);
                const photo = confirmedPhotoIds.has(wilaya.id) ? photoForWilaya(wilaya.name) : null;
                const rotation = STAMP_ROTATIONS[index % STAMP_ROTATIONS.length];
                const isFresh = isStamped && lastStampedId === wilaya.id;

                return (
                  <button
                    key={wilaya.id}
                    type="button"
                    className={`passport-slot ${isStamped ? "is-stamped" : ""}`}
                    onClick={() => toggleStamp(wilaya.id)}
                    aria-pressed={isStamped}
                    aria-label={`${isStamped ? "Retirer" : "Poser"} le tampon ${wilaya.name}`}
                  >
                    <span className="passport-slot-outline" aria-hidden="true">
                      <MapPin size={14} />
                    </span>
                    <span className="passport-slot-label">{wilaya.name}</span>

                    {isStamped && (
                      <span
                        className={`passport-stamp ${isFresh ? "is-fresh" : ""} ${photo ? "has-photo" : "is-text-only"}`}
                        style={{ "--stamp-rotate": `${rotation}deg` }}
                        aria-hidden="true"
                      >
                        <span className="passport-stamp-ring">
                          {photo ? (
                            <img src={photo} alt="" />
                          ) : (
                            <span className="passport-stamp-initial">{wilaya.name.slice(0, 2).toUpperCase()}</span>
                          )}
                        </span>
                        <span className="passport-stamp-textring">
                          <svg viewBox="0 0 100 100" className="passport-stamp-curve-svg">
                            <path id={`stampcurve-${wilaya.id}`} d="M 8,50 A 42,42 0 1,1 92,50" fill="none" />
                            <text fontSize="7.4" letterSpacing="1.5" fill="currentColor">
                              <textPath href={`#stampcurve-${wilaya.id}`} startOffset="50%" textAnchor="middle">
                                WILAYA+ · {wilaya.region.split("—")[0].trim().toUpperCase()}
                              </textPath>
                            </text>
                          </svg>
                        </span>
                        <span className="passport-stamp-date">{stampDate}</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="passport-book-footer">
              <span className="passport-book-footer-tag">{PASSPORT_WILAYAS[0] && `${stampedCount} tampon${stampedCount === 1 ? "" : "s"} posé${stampedCount === 1 ? "" : "s"} dans ce carnet`}</span>
              <button type="button" className="btn-ghost passport-reset" onClick={resetPassport} disabled={stampedCount === 0}>
                <RotateCcw size={14} /> Réinitialiser le carnet
              </button>
            </div>
          </div>
        </section>

        <section className="feature-section fade-up delay-2">
          <div className="feature-section-head">
            <h2>Pourquoi un tampon, et pas un badge</h2>
            <p>Trois choix de conception qui séparent une collection satisfaisante d'une simple case à cocher.</p>
          </div>
          <div className="feature-grid-2">
            <div className="feature-card">
              <div className="feature-card-icon"><StampIcon size={18} /></div>
              <h3>La photo réelle EST le tampon</h3>
              <p>
                Plutôt qu'une icône générique, le médaillon central du tampon est la vraie photo du lieu quand
                elle existe. Le voyageur reconnaît l'endroit dans son propre passeport — la preuve visuelle
                remplace l'abstraction du badge.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon"><Sparkles size={18} /></div>
              <h3>L'imperfection est le style</h3>
              <p>
                Chaque tampon a sa propre rotation, comme un vrai coup d'encre jamais parfaitement droit. C'est
                un détail volontaire : un carnet trop parfait ressemble à un gabarit, pas à un souvenir.
              </p>
            </div>
          </div>
        </section>

        <section className="feature-section fade-up delay-3">
          <div className="fennec-reaction">
            <span style={{ fontSize: 40 }} aria-hidden="true">🦊</span>
            <div>
              <div className="reaction-label">Avis de Fennec</div>
              <p className="reaction-quote">« Un badge, on l'oublie. Un tampon qu'on a posé soi-même, on le raconte. »</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}