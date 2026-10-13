export interface OrtegaSector {
  id: string;
  name: string;
  category: 'plaza' | 'barrio' | 'institucional' | 'ecologico' | 'acceso';
  lat: number;
  lng: number;
  zoom: number;
  description: string;
  keyStreets: string;
}

export const ORTEGA_CENTER = {
  lat: 3.9361,
  lng: -75.2217,
  zoom: 16
};

// Bounding box for Ortega, Tolima (for Nominatim geocoding bounds)
export const ORTEGA_BOUNDS = {
  minLat: 3.9200,
  maxLat: 3.9550,
  minLng: -75.2350,
  maxLng: -75.2050
};

export const ORTEGA_SECTORS: OrtegaSector[] = [
  {
    id: 'parque-principal',
    name: 'Parque Pedro Juventino Ramos Rivera',
    category: 'plaza',
    lat: 3.9361,
    lng: -75.2217,
    zoom: 18,
    description: 'Plaza Central de Ortega, corazón cívico, cultural y comercial del municipio.',
    keyStreets: 'Carrera 5 entre Calles 5 y 6'
  },
  {
    id: 'alcaldia',
    name: 'Alcaldía Municipal de Ortega',
    category: 'institucional',
    lat: 3.9358,
    lng: -75.2212,
    zoom: 18,
    description: 'Sede administrativa del gobierno municipal y punto de contacto ciudadano.',
    keyStreets: 'Calle 6 # 5 - 30, Barrio Centro'
  },
  {
    id: 'barrio-centro',
    name: 'Barrio Centro',
    category: 'barrio',
    lat: 3.9365,
    lng: -75.2210,
    zoom: 17,
    description: 'Zona de comercio tradicional, almacenes, panaderías y andenes de alto flujo peatonal.',
    keyStreets: 'Calles 5, 6 y 7 con Carreras 4 y 5'
  },
  {
    id: 'juan-23',
    name: 'Barrio Juan XXIII (Juan 23)',
    category: 'barrio',
    lat: 3.9378,
    lng: -75.2195,
    zoom: 17,
    description: 'Sector residencial vibrante en el nororiente con calles empedradas y pavimentadas.',
    keyStreets: 'Calle 3 con Carrera 2 y Carrera 3'
  },
  {
    id: 'san-fernando',
    name: 'Barrio San Fernando',
    category: 'barrio',
    lat: 3.9392,
    lng: -75.2223,
    zoom: 17,
    description: 'Barrio tradicional del norte de Ortega con pasajes peatonales y casas familiares.',
    keyStreets: 'Carrera 7 con Calles 7 y 8'
  },
  {
    id: 'nueva-granada',
    name: 'Barrio Nueva Granada',
    category: 'barrio',
    lat: 3.9349,
    lng: -75.2241,
    zoom: 17,
    description: 'Sector residencial en el occidente con zonas verdes y vías de conexión barrial.',
    keyStreets: 'Calle 4 con Carrera 7 y Carrera 8'
  },
  {
    id: 'el-prado',
    name: 'Barrio El Prado',
    category: 'barrio',
    lat: 3.9341,
    lng: -75.2185,
    zoom: 17,
    description: 'Barrio oriental con amplias cuadras y canchas deportivas comunitarias.',
    keyStreets: 'Carrera 2 con Calle 4 y Calle 5'
  },
  {
    id: 'nicolas-ramirez',
    name: 'Barrio Nicolás Ramírez',
    category: 'barrio',
    lat: 3.9332,
    lng: -75.2225,
    zoom: 17,
    description: 'Sector del sur urbano de Ortega, comunidad muy organizada de guardianes ambientales.',
    keyStreets: 'Carrera 6 con Calles 1 y 2'
  },
  {
    id: 'la-alameda',
    name: 'Barrio La Alameda',
    category: 'barrio',
    lat: 3.9318,
    lng: -75.2215,
    zoom: 17,
    description: 'Entrada y corredor arborizado al sur del perímetro urbano.',
    keyStreets: 'Carrera 5 Sur con Calle 1'
  },
  {
    id: 'rio-ortega',
    name: 'Ronda del Río Ortega / Malecón',
    category: 'ecologico',
    lat: 3.9388,
    lng: -75.2238,
    zoom: 17,
    description: 'Cuenca hídrica vital de Ortega. Requiere protección permanente contra vertimientos ilegales de residuos.',
    keyStreets: 'Calle 7 hacia margen del Río Ortega'
  }
];

export const MAP_LAYERS = [
  {
    id: 'osm-calles',
    name: 'Calles y Nombres (OSM Estándar)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
    badge: 'Detalle de Calles'
  },
  {
    id: 'carto-voyager',
    name: 'Calles Nítidas y Contraste',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO &copy; OSM',
    maxZoom: 19,
    badge: 'Recomendado'
  },
  {
    id: 'satellite',
    name: 'Satelital Fotográfico',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics',
    maxZoom: 18,
    badge: 'Foto Aérea'
  }
];
