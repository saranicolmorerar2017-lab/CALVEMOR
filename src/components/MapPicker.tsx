import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Crosshair,
  MapPin,
  Loader2,
  Layers,
  Search,
  Compass,
  Navigation2,
  Building2,
  Check,
  RotateCcw
} from 'lucide-react';
import { TrashReport } from '../types';
import { STATUS_CONFIG } from '../data/initialReports';
import {
  ORTEGA_CENTER,
  ORTEGA_SECTORS,
  MAP_LAYERS,
  ORTEGA_BOUNDS,
  OrtegaSector
} from '../data/ortegaTolimaData';

interface MapPickerProps {
  currentLat: number;
  currentLng: number;
  onLocationChange?: (lat: number, lng: number, addressSuggestion?: string) => void;
  interactiveSelect?: boolean;
  reports?: TrashReport[];
  selectedReportId?: string | null;
  onSelectReport?: (report: TrashReport) => void;
  heightClass?: string;
  showSectorsBar?: boolean;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  currentLat,
  currentLng,
  onLocationChange,
  interactiveSelect = false,
  reports = [],
  selectedReportId,
  onSelectReport,
  heightClass = 'h-72 sm:h-96',
  showSectorsBar = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const activeMarkerRef = useRef<L.Marker | null>(null);
  const reportMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeLayerId, setActiveLayerId] = useState<string>('osm-calles');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResultNotice, setSearchResultNotice] = useState<string | null>(null);
  const [activeSectorId, setActiveSectorId] = useState<string>('parque-principal');

  // Fallback to Ortega Center if lat/lng is 0 or Bogotá
  const initialLat =
    currentLat && currentLat > 3.0 && currentLat < 4.2 ? currentLat : ORTEGA_CENTER.lat;
  const initialLng =
    currentLng && currentLng < -74.8 && currentLng > -75.8 ? currentLng : ORTEGA_CENTER.lng;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: ORTEGA_CENTER.zoom,
        zoomControl: true,
        attributionControl: false
      });

      // Default layer (OSM Streets with Spanish street names & numbers)
      const defaultLayerConfig = MAP_LAYERS[0];
      const tileLayer = L.tileLayer(defaultLayerConfig.url, {
        maxZoom: defaultLayerConfig.maxZoom
      }).addTo(map);

      currentTileLayerRef.current = tileLayer;
      reportMarkersLayerRef.current = L.layerGroup().addTo(map);

      // Handle map clicks in interactive mode
      if (interactiveSelect && onLocationChange) {
        map.on('click', async (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          updateSelectedPosition(lat, lng, true);
        });
      }

      mapInstanceRef.current = map;

      // Invalidate size shortly after mount in case layout shifted
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {
      // Map cleanup on unmount handled gracefully
    };
  }, []);

  // Change Tile Layer
  const switchLayer = (layerId: string) => {
    if (!mapInstanceRef.current) return;
    const selected = MAP_LAYERS.find((l) => l.id === layerId);
    if (!selected) return;

    if (currentTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(currentTileLayerRef.current);
    }

    const newLayer = L.tileLayer(selected.url, {
      maxZoom: selected.maxZoom
    }).addTo(mapInstanceRef.current);

    currentTileLayerRef.current = newLayer;
    setActiveLayerId(layerId);
    setShowLayerMenu(false);
  };

  // Fly to sector in Ortega
  const handleFlyToSector = (sector: OrtegaSector) => {
    setActiveSectorId(sector.id);
    if (!mapInstanceRef.current) return;

    mapInstanceRef.current.flyTo([sector.lat, sector.lng], sector.zoom, {
      duration: 1.2
    });

    if (interactiveSelect && onLocationChange) {
      updateSelectedPosition(sector.lat, sector.lng, false, `${sector.keyStreets}, Ortega (Tolima)`);
    }
  };

  // Update center or active pin if currentLat/currentLng changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const validLat =
      currentLat && currentLat > 3.0 && currentLat < 4.2 ? currentLat : ORTEGA_CENTER.lat;
    const validLng =
      currentLng && currentLng < -74.8 && currentLng > -75.8 ? currentLng : ORTEGA_CENTER.lng;

    if (interactiveSelect) {
      if (activeMarkerRef.current) {
        activeMarkerRef.current.setLatLng([validLat, validLng]);
      } else {
        const pickerIcon = L.divIcon({
          className: 'custom-picker-pin',
          html: `
            <div style="transform: translate(-50%, -100%);" class="flex flex-col items-center">
              <div class="bg-emerald-600 text-white p-2 rounded-full shadow-lg border-2 border-white ring-4 ring-emerald-400/50 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div class="w-2.5 h-1 bg-slate-900/30 rounded-full blur-[1px]"></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });

        activeMarkerRef.current = L.marker([validLat, validLng], {
          icon: pickerIcon,
          draggable: true
        }).addTo(map);

        activeMarkerRef.current.on('dragend', (event) => {
          const marker = event.target;
          const pos = marker.getLatLng();
          updateSelectedPosition(pos.lat, pos.lng, false);
        });
      }
    }
  }, [currentLat, currentLng, interactiveSelect]);

  // Render report markers
  useEffect(() => {
    if (!mapInstanceRef.current || !reportMarkersLayerRef.current) return;
    const layerGroup = reportMarkersLayerRef.current;
    layerGroup.clearLayers();

    reports.forEach((rep) => {
      if (!rep.location || !rep.location.lat || !rep.location.lng) return;

      const isSelected = rep.id === selectedReportId;
      const statusColor =
        rep.status === 'solucionado'
          ? 'bg-emerald-600'
          : rep.status === 'en_proceso'
          ? 'bg-sky-600'
          : 'bg-amber-600';

      const pinIcon = L.divIcon({
        className: 'custom-report-pin',
        html: `
          <div style="transform: translate(-50%, -100%); cursor: pointer;" class="flex flex-col items-center group">
            <div class="${statusColor} text-white p-1.5 rounded-full shadow-md border-2 border-white ${
              isSelected ? 'ring-4 ring-emerald-400 scale-125' : 'hover:scale-110'
            } transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </div>
            <div class="px-1.5 py-0.5 rounded bg-slate-900/90 text-white text-[10px] font-semibold whitespace-nowrap shadow-sm mt-0.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              ${rep.location.address?.split(',')[0] || rep.title.slice(0, 18)}
            </div>
          </div>
        `,
        iconSize: [32, 36],
        iconAnchor: [16, 28]
      });

      const marker = L.marker([rep.location.lat, rep.location.lng], { icon: pinIcon });

      marker.on('click', () => {
        if (onSelectReport) {
          onSelectReport(rep);
        }
      });

      const statusInfo = STATUS_CONFIG[rep.status];

      marker.bindPopup(`
        <div class="p-1 text-slate-800 text-xs font-sans max-w-[220px]">
          <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${statusInfo.color} mb-1">
            ${statusInfo.label}
          </span>
          <h4 class="font-bold text-xs text-slate-900 mb-1 leading-tight">${rep.title}</h4>
          <p class="text-emerald-800 text-[11px] font-medium mb-1">${rep.location.address}</p>
          <img src="${rep.photoUrl}" alt="${rep.title}" class="w-full h-24 object-cover rounded mb-1" />
          <p class="text-[10px] text-slate-500">Ortega, Tolima</p>
        </div>
      `);

      layerGroup.addLayer(marker);
    });
  }, [reports, selectedReportId]);

  const updateSelectedPosition = async (
    lat: number,
    lng: number,
    pan: boolean,
    forcedAddress?: string
  ) => {
    if (mapInstanceRef.current && pan) {
      mapInstanceRef.current.panTo([lat, lng]);
    }
    if (activeMarkerRef.current) {
      activeMarkerRef.current.setLatLng([lat, lng]);
    }

    let addressGuess = forcedAddress || '';

    if (!forcedAddress) {
      try {
        // Reverse geocode via OpenStreetMap Nominatim
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          { headers: { 'Accept-Language': 'es' } }
        );
        if (res.ok) {
          const data = await res.json();
          const road = data.address?.road || data.address?.pedestrian || '';
          const suburb = data.address?.suburb || data.address?.neighbourhood || '';
          const town = data.address?.town || data.address?.city || 'Ortega';

          if (road) {
            addressGuess = `${road}${suburb ? `, ${suburb}` : ''}, ${town} (Tolima)`;
          } else {
            addressGuess = data.display_name?.split(',').slice(0, 3).join(',') || '';
          }
        }
      } catch {
        addressGuess = `Ortega, Tolima (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      }
    }

    if (onLocationChange) {
      onLocationChange(lat, lng, addressGuess || 'Ortega, Tolima');
    }
  };

  // Search Street or Location inside Ortega, Tolima
  const handleStreetSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResultNotice(null);

    try {
      // Query restricted to Colombia and prioritized around Ortega coordinates
      const query = `${searchQuery.trim()}, Ortega, Tolima, Colombia`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&countrycodes=co&viewbox=${ORTEGA_BOUNDS.minLng},${ORTEGA_BOUNDS.maxLat},${
        ORTEGA_BOUNDS.maxLng
      },${ORTEGA_BOUNDS.minLat}&bounded=0&limit=3`;

      const res = await fetch(url, { headers: { 'Accept-Language': 'es' } });
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const best = results[0];
          const newLat = parseFloat(best.lat);
          const newLng = parseFloat(best.lon);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([newLat, newLng], 17, { duration: 1.5 });
          }

          if (interactiveSelect && onLocationChange) {
            updateSelectedPosition(newLat, newLng, false, best.display_name?.split(',').slice(0, 3).join(','));
          }

          setSearchResultNotice(`Encontrado: ${best.display_name?.split(',')[0]} en Ortega`);
        } else {
          // Check local preset sectors for quick match
          const matchSector = ORTEGA_SECTORS.find(
            (s) =>
              s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.keyStreets.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (matchSector) {
            handleFlyToSector(matchSector);
            setSearchResultNotice(`Ubicado en: ${matchSector.name}`);
          } else {
            setSearchResultNotice('No se encontró esa dirección exacta. Puedes señalarla directamente en el mapa.');
          }
        }
      }
    } catch {
      setSearchResultNotice('Error al consultar el nomenclador. Puedes tocar el punto exacto en el mapa.');
    } finally {
      setIsSearching(false);
    }
  };

  const locateUserGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Tu dispositivo no soporta geolocalización.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 17);
        }
        updateSelectedPosition(latitude, longitude, true);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        setGpsError('No se pudo obtener la ubicación exacta. Selecciona el punto tocando en el mapa.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const resetToOrtegaCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([ORTEGA_CENTER.lat, ORTEGA_CENTER.lng], ORTEGA_CENTER.zoom, {
        duration: 1.2
      });
    }
    if (interactiveSelect && onLocationChange) {
      updateSelectedPosition(
        ORTEGA_CENTER.lat,
        ORTEGA_CENTER.lng,
        false,
        'Carrera 5 con Calle 6, Parque Principal, Ortega (Tolima)'
      );
    }
  };

  return (
    <div className="space-y-3">
      {/* Search and Navigation Bar for Ortega, Tolima */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
        <form onSubmit={handleStreetSearch} className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar calle, carrera o barrio en Ortega (ej. Calle 6, Cra 5, Juan 23)..."
            className="w-full pl-9 pr-20 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-1.5 top-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shadow-xs transition disabled:opacity-50"
          >
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        <div className="flex items-center gap-2">
          {/* Reset to Ortega */}
          <button
            type="button"
            onClick={resetToOrtegaCenter}
            className="flex items-center gap-1.5 px-3 py-2 bg-white text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl border border-slate-200 text-xs font-semibold shadow-xs transition shrink-0"
            title="Centrar en el Parque Principal de Ortega, Tolima"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Centrar Ortega</span>
          </button>

          {/* Layer switcher button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white text-slate-700 hover:text-slate-900 rounded-xl border border-slate-200 text-xs font-semibold shadow-xs transition"
              title="Cambiar capa cartográfica"
            >
              <Layers className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Capas</span>
            </button>

            {showLayerMenu && (
              <div className="absolute right-0 top-11 z-30 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Estilo de Mapa
                </div>
                {MAP_LAYERS.map((layer) => (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => switchLayer(layer.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                      activeLayerId === layer.id
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{layer.name}</span>
                    {activeLayerId === layer.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {searchResultNotice && (
        <div className="text-xs px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between animate-fadeIn">
          <span>{searchResultNotice}</span>
          <button
            type="button"
            onClick={() => setSearchResultNotice(null)}
            className="text-emerald-600 font-bold text-sm ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Quick Sectors / Calles de Ortega Navigator Bar */}
      {showSectorsBar && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Calles y Sectores:</span>
          </span>
          {ORTEGA_SECTORS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => handleFlyToSector(sec)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition border shrink-0 ${
                activeSectorId === sec.id
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
              title={`${sec.name}: ${sec.keyStreets}`}
            >
              {sec.name.replace('Barrio ', '')}
            </button>
          ))}
        </div>
      )}

      {/* Main Map Canvas Container */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
        <div ref={mapContainerRef} className={`w-full ${heightClass}`} />

        {/* Municipality watermark badge */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-lg border border-white/10 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider leading-none">
                Municipio de Ortega • Tolima
              </p>
              <p className="text-[9px] text-slate-300 font-medium">
                Red Vial, Calles, Carreras y Puntos Críticos
              </p>
            </div>
          </div>
        </div>

        {/* Floating GPS button */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={locateUserGps}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-sm text-slate-800 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl shadow-md border border-slate-200 text-xs font-semibold transition"
            title="Detectar mi ubicación actual con GPS"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            ) : (
              <Crosshair className="w-4 h-4 text-emerald-600" />
            )}
            <span>{isLocating ? 'Detectando...' : 'Mi GPS'}</span>
          </button>
        </div>

        {interactiveSelect && (
          <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none flex justify-center">
            <div className="bg-slate-900/90 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Toca cualquier calle de Ortega o arrastra el pin al punto exacto</span>
            </div>
          </div>
        )}

        {gpsError && (
          <div className="absolute top-16 left-3 right-3 z-20 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-2 rounded-xl text-xs shadow-md">
            {gpsError}
          </div>
        )}
      </div>

      {/* Street & Reference helper footer */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 px-1 gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            Cabecera urbana: <strong>Ortega (Tolima)</strong> • Elevación 402 m s. n. m.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pendiente
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span> En Gestión
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Solucionado
          </span>
        </div>
      </div>
    </div>
  );
};
