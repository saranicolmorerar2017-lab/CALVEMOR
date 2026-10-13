export type WasteCategory =
  | 'plastico_envases'
  | 'escombros_construccion'
  | 'organicos_vegetales'
  | 'cacharros_muebles'
  | 'microbasural'
  | 'contenedor_desbordado'
  | 'electronicos_peligrosos';

export type ReportSeverity = 'baja' | 'media' | 'alta' | 'critica';

export type ReportStatus = 'pendiente' | 'en_proceso' | 'solucionado';

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  referenceZone: string;
}

export interface SolutionEvidence {
  photoUrl: string;
  resolvedAt: string;
  resolvedBy: string;
  notes: string;
  squadName?: string;
}

export interface TrashReport {
  id: string;
  title: string;
  description: string;
  wasteType: WasteCategory;
  severity: ReportSeverity;
  status: ReportStatus;
  location: LocationData;
  photoUrl: string;
  createdAt: string;
  reportedBy: string;
  reporterContact?: string;
  upvotes: number;
  solutionEvidence?: SolutionEvidence;
  assignedBrigade?: string;
  estimatedWeightKg?: number;
}

export interface CommunityImpactStats {
  totalReports: number;
  resolvedReports: number;
  inProgressReports: number;
  pendingReports: number;
  estimatedWasteKgCleaned: number;
  publicSpacesRecovered: number;
  activeEcoGuardians: number;
}

export type ViewMode = 'list' | 'map' | 'evidences' | 'impact';
