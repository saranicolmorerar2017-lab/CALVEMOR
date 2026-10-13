import { TrashReport, CommunityImpactStats, SolutionEvidence } from '../types';
import { INITIAL_REPORTS } from '../data/initialReports';

const STORAGE_KEY = 'eco_guardianes_ortega_tolima_v3';

export function getReports(): TrashReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Auto-migrate if old data outside Ortega (e.g. lat > 4.2)
      const hasBogotaCoords = parsed.some(
        (r: TrashReport) => r.location && (r.location.lat > 4.2 || r.location.lat < 3.5)
      );
      if (hasBogotaCoords) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
        return INITIAL_REPORTS;
      }
      return parsed;
    }
    return INITIAL_REPORTS;
  } catch (err) {
    console.error('Error loading reports from localStorage:', err);
    return INITIAL_REPORTS;
  }
}

export function saveReports(reports: TrashReport[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (err) {
    console.error('Error saving reports:', err);
  }
}

export function addReport(newReport: Omit<TrashReport, 'id' | 'createdAt' | 'status' | 'upvotes'>): TrashReport {
  const reports = getReports();
  const created: TrashReport = {
    ...newReport,
    id: `rep-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'pendiente',
    upvotes: 1
  };
  const updated = [created, ...reports];
  saveReports(updated);
  return created;
}

export function upvoteReport(id: string): TrashReport[] {
  const reports = getReports();
  const updated = reports.map((r) => {
    if (r.id === id) {
      return { ...r, upvotes: (r.upvotes || 0) + 1 };
    }
    return r;
  });
  saveReports(updated);
  return updated;
}

export function updateReportStatus(id: string, status: TrashReport['status'], assignedBrigade?: string): TrashReport[] {
  const reports = getReports();
  const updated = reports.map((r) => {
    if (r.id === id) {
      return {
        ...r,
        status,
        assignedBrigade: assignedBrigade !== undefined ? assignedBrigade : r.assignedBrigade
      };
    }
    return r;
  });
  saveReports(updated);
  return updated;
}

export function resolveReportWithEvidence(id: string, evidence: SolutionEvidence): TrashReport[] {
  const reports = getReports();
  const updated = reports.map((r) => {
    if (r.id === id) {
      return {
        ...r,
        status: 'solucionado' as const,
        solutionEvidence: evidence
      };
    }
    return r;
  });
  saveReports(updated);
  return updated;
}

export function resetToDefaults(): TrashReport[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
  return INITIAL_REPORTS;
}

export function calculateStats(reports: TrashReport[]): CommunityImpactStats {
  const totalReports = reports.length;
  const resolvedReports = reports.filter((r) => r.status === 'solucionado').length;
  const inProgressReports = reports.filter((r) => r.status === 'en_proceso').length;
  const pendingReports = reports.filter((r) => r.status === 'pendiente').length;

  const estimatedWasteKgCleaned = reports
    .filter((r) => r.status === 'solucionado')
    .reduce((acc, curr) => acc + (curr.estimatedWeightKg || 50), 0);

  // Approximate unique public spaces cleaned
  const publicSpacesRecovered = resolvedReports;
  const activeEcoGuardians = Math.max(12, totalReports * 3 + 8);

  return {
    totalReports,
    resolvedReports,
    inProgressReports,
    pendingReports,
    estimatedWasteKgCleaned,
    publicSpacesRecovered,
    activeEcoGuardians
  };
}
