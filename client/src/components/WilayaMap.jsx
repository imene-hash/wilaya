/* Direction : carnet de route saharien — la carte est un fragment de carnet déplié, pas un widget SaaS.
   Fennec se tient debout aux points forts du pays ; zoomer ou cliquer sur lui ouvre l'étape correspondante. */
import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ChevronRight } from "lucide-react";
import { ASSETS } from "../lib/wilayaData";

// Centre choisi pour bien montrer l'étendue Tlemcen → Illizi sans pousser le Maroc dans le cadre.
const ALGERIA_CENTER = [33.2, 4.2];
const DEFAULT_ZOOM = 5;

/* Icône Fennec : un pin en forme de goutte "carnet" avec le portrait de Fennec détouré au centre.
   On construit un divIcon plutôt qu'un marker Leaflet par défaut pour garder la patte carnet-saharien. */
function buildFennecIcon({ active }) {
  const size = active ? 54 : 44;
  return L.divIcon({
    className: "",
    html: `
      <div class="fennec-pin ${active ? "is-active" : ""}">
        <span class="fennec-pin-halo"></span>
        <span class="fennec-pin-body fennec-pin-character">
          <img src="${ASSETS.mark}" alt="" />
        </span>
        <span class="fennec-pin-point"></span>
      </div>
    `,
    iconSize: [size, size + 14],
    iconAnchor: [size / 2, size + 12],
    popupAnchor: [0, -(size + 6)],
  });
}

/* Recentre la carte en douceur quand une région est sélectionnée depuis la liste de cartes. */
function FlyToRegion({ region }) {
  // Disabled: zoom animation was cutting off the popup card
  return null;
}

/* Recadre automatiquement la carte pour que toutes les régions filtrées restent visibles —
   sauf quand "Toutes" est actif : avec 15 pins de Tlemcen à Illizi, un fit strict aux bounds
   pousse le cadrage trop à l'ouest (vers le Maroc) pour respecter l'étendue est-ouest.
   Dans ce cas on garde un centre/zoom fixes, pensés pour bien montrer l'Algérie utile. */
function FitToRegions({ regions, isFiltered }) {
  const map = useMap();
  const previousKey = useRef(null);
  useEffect(() => {
    if (!regions.length) return;
    const key = `${isFiltered}-${regions.length}`;
    if (previousKey.current === key) return;
    previousKey.current = key;

    if (!isFiltered) {
      map.flyTo(ALGERIA_CENTER, DEFAULT_ZOOM, { duration: 0.7 });
      return;
    }
    const bounds = L.latLngBounds(regions.map((r) => [r.lat, r.lng]));
    map.flyToBounds(bounds, { padding: [56, 56], maxZoom: 8, duration: 0.7 });
  }, [regions, isFiltered, map]);
  return null;
}

export default function WilayaMap({ regions, activeId, onSelect, onDiscover, isFiltered = false }) {
  const [internalActive, setInternalActive] = useState(activeId ?? null);
  const markerRefs = useRef({});

  useEffect(() => { setInternalActive(activeId ?? null); }, [activeId]);

  const handleMarkerClick = useCallback((region) => {
    setInternalActive(region.id);
    onSelect?.(region.id);
  }, [onSelect]);

  const activeRegion = regions.find((r) => r.id === internalActive) || null;

  return (
    <div className="wilaya-map-frame">
      <MapContainer
        center={ALGERIA_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={4}
        maxZoom={11}
        scrollWheelZoom={false}
        className="wilaya-map-canvas"
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />
        <FitToRegions regions={regions} isFiltered={isFiltered} />
        <FlyToRegion region={activeRegion} />
        {regions.map((region) => (
          <Marker
            key={region.id}
            position={[region.lat, region.lng]}
            icon={buildFennecIcon({ active: region.id === internalActive })}
            eventHandlers={{ click: () => handleMarkerClick(region) }}
            ref={(el) => { if (el) markerRefs.current[region.id] = el; }}
          >
            <Popup className="wilaya-map-popup" closeButton={false} offset={[0, -4]}>
              <div className="map-popup-card">
                <div className="map-popup-image">
                  <img src={region.image} alt={region.title} loading="eager" />
                  <span className="map-popup-wilaya">{region.wilaya}</span>
                </div>
                <div className="map-popup-body">
                  <span className="map-popup-vibe">{region.vibe}</span>
                  <h4>{region.title}</h4>
                  <p>{region.desc}</p>
                  <button type="button" className="map-popup-cta" onClick={() => onDiscover?.(region)}>
                    Découvrir avec Fennec <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="wilaya-map-hint">
        <span className="fennec-pin-mini" aria-hidden="true"><img src={ASSETS.mark} alt="" /></span>
        Clique sur Fennec pour ouvrir une destination
      </div>
    </div>
  );
}