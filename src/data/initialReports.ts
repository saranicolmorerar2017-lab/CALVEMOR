import { TrashReport } from '../types';

export const INITIAL_REPORTS: TrashReport[] = [
  {
    id: 'rep-101',
    title: 'Botellas plásticas y residuos en el Parque Pedro Juventino Ramos',
    description: 'Bolsas plásticas, vasos descartables y botellas esparcidas cerca de las bancas y jardineras del Parque Principal de Ortega.',
    wasteType: 'plastico_envases',
    severity: 'media',
    status: 'solucionado',
    location: {
      lat: 3.9362,
      lng: -75.2216,
      address: 'Carrera 5 con Calle 6, Parque Principal',
      referenceZone: 'Parque Pedro Juventino Ramos Rivera (Centro)'
    },
    photoUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    reportedBy: 'Camila Rojas (Vecina Barrio Centro)',
    reporterContact: 'crojas@ortega-comunidad.org',
    upvotes: 24,
    estimatedWeightKg: 45,
    assignedBrigade: 'Brigada Juvenil Eco-Ortega',
    solutionEvidence: {
      photoUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
      resolvedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      resolvedBy: 'Brigada Eco-Ortega y Comerciantes de la Plaza',
      notes: 'Jornada cívica completada: recolección total de plásticos, lavado de andén y colocación de caneca comunitaria.',
      squadName: 'Guardianes del Parque Central'
    }
  },
  {
    id: 'rep-102',
    title: 'Escombros de construcción en andén del Barrio Juan XXIII',
    description: 'Restos de ladrillos partidos, costales de arena y maderas bloqueando el paso peatonal escolar en la Calle 3.',
    wasteType: 'escombros_construccion',
    severity: 'alta',
    status: 'en_proceso',
    location: {
      lat: 3.9378,
      lng: -75.2195,
      address: 'Calle 3 con Carrera 2 #2-18',
      referenceZone: 'Barrio Juan XXIII (Juan 23), Ortega'
    },
    photoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    reportedBy: 'Don Carlos Mendoza (Líder Comunitario)',
    upvotes: 18,
    estimatedWeightKg: 180,
    assignedBrigade: 'Volqueta de Servicios Públicos Municipales'
  },
  {
    id: 'rep-103',
    title: 'Punto crítico: microbasural en ronda del Río Ortega / Malecón',
    description: 'Acumulación clandestina de bolsas de residuos orgánicos, ramas y bolsas plásticas al borde del río sobre la Calle 7.',
    wasteType: 'microbasural',
    severity: 'critica',
    status: 'pendiente',
    location: {
      lat: 3.9388,
      lng: -75.2238,
      address: 'Calle 7 con Carrera 6, Sector Río Ortega',
      referenceZone: 'Ronda ambiental Río Ortega / Malecón'
    },
    photoUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    reportedBy: 'Mateo Gómez (Defensor de la Cuenca Tetuán-Ortega)',
    upvotes: 31,
    estimatedWeightKg: 320
  },
  {
    id: 'rep-104',
    title: 'Contenedor público desbordado cerca a la Alcaldía Municipal',
    description: 'El depósito de residuos de la esquina institucional sobrepasó su capacidad y hay desechos sobre el asfalto.',
    wasteType: 'contenedor_desbordado',
    severity: 'alta',
    status: 'pendiente',
    location: {
      lat: 3.9358,
      lng: -75.2212,
      address: 'Calle 6 #5-30, Frente a Alcaldía',
      referenceZone: 'Barrio Centro Institucional, Ortega'
    },
    photoUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    reportedBy: 'Laura Valenzuela (Comerciante)',
    upvotes: 15,
    estimatedWeightKg: 95
  },
  {
    id: 'rep-105',
    title: 'Mueble viejo y enseres en esquina del Barrio San Fernando',
    description: 'Sillón deteriorado y restos de madera abandonados en la esquina de la Carrera 7 con Calle 8.',
    wasteType: 'cacharros_muebles',
    severity: 'media',
    status: 'solucionado',
    location: {
      lat: 3.9392,
      lng: -75.2223,
      address: 'Carrera 7 con Calle 8',
      referenceZone: 'Barrio San Fernando, Ortega'
    },
    photoUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    reportedBy: 'Junta de Acción Comunal San Fernando',
    upvotes: 19,
    estimatedWeightKg: 70,
    assignedBrigade: 'Comité de Aseo San Fernando Limpio',
    solutionEvidence: {
      photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      resolvedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      resolvedBy: 'Vecinos de San Fernando y Cuadrilla Ecológica',
      notes: 'Se recogió el mueble en ruta especial de recolección de cacharros. Espacio completamente despejado.',
      squadName: 'Brigada San Fernando Verde'
    }
  },
  {
    id: 'rep-106',
    title: 'Poda de árboles y restos vegetales en Barrio Nueva Granada',
    description: 'Ramas gruesas y follaje acumulados tras poda doméstica que obstaculizan la cuneta de aguas lluvias.',
    wasteType: 'organicos_vegetales',
    severity: 'media',
    status: 'pendiente',
    location: {
      lat: 3.9349,
      lng: -75.2241,
      address: 'Calle 4 con Carrera 8',
      referenceZone: 'Barrio Nueva Granada, Ortega'
    },
    photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    reportedBy: 'Alfonso Triana',
    upvotes: 11,
    estimatedWeightKg: 110
  }
];

export const WASTE_CATEGORIES_INFO: Record<string, { label: string; iconName: string; color: string; bg: string }> = {
  plastico_envases: {
    label: 'Plásticos y Envases',
    iconName: 'Package',
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200'
  },
  escombros_construccion: {
    label: 'Escombros de Obra',
    iconName: 'Hammer',
    color: 'text-stone-600',
    bg: 'bg-stone-50 border-stone-200'
  },
  organicos_vegetales: {
    label: 'Orgánicos y Podas',
    iconName: 'Leaf',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200'
  },
  cacharros_muebles: {
    label: 'Muebles y Voluminosos',
    iconName: 'Armchair',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 border-indigo-200'
  },
  microbasural: {
    label: 'Microbasural Clandestino',
    iconName: 'AlertTriangle',
    color: 'text-rose-600',
    bg: 'bg-rose-50 border-rose-200'
  },
  contenedor_desbordado: {
    label: 'Contenedor Desbordado',
    iconName: 'Trash2',
    color: 'text-orange-600',
    bg: 'bg-orange-50 border-orange-200'
  },
  electronicos_peligrosos: {
    label: 'Peligrosos / Electrónicos',
    iconName: 'Zap',
    color: 'text-purple-600',
    bg: 'bg-purple-50 border-purple-200'
  }
};

export const SEVERITY_CONFIG = {
  baja: { label: 'Baja', color: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500' },
  media: { label: 'Media', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', dot: 'bg-yellow-500' },
  alta: { label: 'Alta', color: 'bg-orange-100 text-orange-800 border-orange-200', dot: 'bg-orange-500' },
  critica: { label: 'Crítica / Urgente', color: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-600' }
};

export const STATUS_CONFIG = {
  pendiente: { label: 'Reportado (Pendiente)', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  en_proceso: { label: 'En Gestión / Brigada', color: 'bg-sky-100 text-sky-800 border-sky-300' },
  solucionado: { label: '¡Limpio / Solucionado!', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
};
