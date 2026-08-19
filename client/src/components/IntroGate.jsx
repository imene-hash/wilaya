/* Direction : porte de médina — deux battants avec du poids réel (perspective, ombre
   projetée) s'ouvrent sur commande. L'emblème arrive depuis la profondeur et se
   stabilise avec un halo avant que le titre n'apparaisse sur scène dégagée.
   Chorégraphie en 4 temps, pas un simple split statique. */
import { useEffect, useRef, useState } from "react";

// phases: gate (waiting for tap) -> opening (doors swing) -> reveal (title in) -> done
const TIMINGS = { opening: 1500, reveal: 1900 };

export default function IntroGate({ children }) {
  const [phase, setPhase] = useState("gate");
  const audioRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const handleEnter = () => {
    if (phase !== "gate") return;

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    setPhase("opening");
    timers.current.push(
      window.setTimeout(() => setPhase("reveal"), TIMINGS.opening)
    );
    timers.current.push(
      window.setTimeout(() => {
        setPhase("done");
      }, TIMINGS.opening + TIMINGS.reveal)
    );
  };

  return (
    <>
      <audio ref={audioRef} preload="auto">
        <source src="/algeria-audio.mp3" type="audio/mpeg" />
      </audio>

      {phase === "done" ? children : <div
        className={`intro-gate intro-gate--${phase}`}
        role="button"
        tabIndex={0}
        aria-label="Entrer sur Wilaya+"
        onClick={handleEnter}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleEnter()}
      >
        <div className="intro-stage">
          <video
            className="intro-flag-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src="/flag-video.mp4" type="video/mp4" />
          </video>
          <div className="intro-video-shade" aria-hidden="true" />
          <div className="intro-door intro-door--left">
            <div className="intro-door-face" />
            <div className="intro-door-edge" />
          </div>
          <div className="intro-door intro-door--right">
            <div className="intro-door-face" />
            <div className="intro-door-edge" />
          </div>

          <div className="intro-seam-glow" />

          <div className="intro-emblem-wrap">
            <div className="intro-emblem-halo" />
            <svg className="intro-emblem" viewBox="0 0 300 200" aria-label="Drapeau algérien" role="img">
              <defs>
                <clipPath id="flag-shape">
                  <rect width="300" height="200" rx="8" />
                </clipPath>
                <mask id="crescent-cutout">
                  <rect width="300" height="200" fill="white" />
                  <circle cx="162" cy="100" r="40" fill="black" />
                </mask>
                <filter id="fabric-wave" x="-8%" y="-12%" width="116%" height="124%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.012 0.09" numOctaves="2" seed="9" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                </filter>
                <linearGradient id="fabric-light" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="white" stopOpacity="0.08" />
                  <stop offset="0.32" stopColor="white" stopOpacity="0.23" />
                  <stop offset="0.55" stopColor="black" stopOpacity="0.12" />
                  <stop offset="0.78" stopColor="white" stopOpacity="0.18" />
                  <stop offset="1" stopColor="black" stopOpacity="0.08" />
                </linearGradient>
              </defs>
              <g clipPath="url(#flag-shape)" filter="url(#fabric-wave)">
                <rect width="150" height="200" fill="#006233" />
                <rect x="150" width="150" height="200" fill="#f7f7f2" />
                <circle cx="145" cy="100" r="52" fill="#d21034" mask="url(#crescent-cutout)" />
                <polygon fill="#d21034" points="171,73 177.3,91.1 196.5,91.7 181.3,103.5 186.7,122 171,111 155.3,122 160.7,103.5 145.5,91.7 164.7,91.1" />
                <rect width="300" height="200" fill="url(#fabric-light)" />
              </g>
              <rect x="1" y="1" width="298" height="198" rx="7" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
            </svg>
          </div>

          <div className="intro-content">
            <span className="intro-eyebrow">ولاية · Wilaya+</span>
            <h1 className="intro-title">Bienvenue en Algérie</h1>
            <p className="intro-sub">Votre voyage, votre humeur, votre carnet de route</p>
          </div>

          {phase === "gate" && (
            <div className="intro-tap-gate">
              <span className="intro-tap-ring" />
              <span className="intro-tap-label">Touchez pour entrer</span>
            </div>
          )}
        </div>
      </div>}

      {phase === "reveal" && children}
    </>
  );
}
