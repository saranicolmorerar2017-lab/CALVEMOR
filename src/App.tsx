import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TreePine,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCcw,
  SlidersHorizontal
} from 'lucide-react';
import { TrashReport, ViewMode, WasteCategory, SolutionEvidence } from './types';
import {
  getReports,
  addReport,
  upvoteReport,
  updateReportStatus,
  resolveReportWithEvidence,
  resetToDefaults,
  calculateStats
} from './services/storageService';
import { Header } from './components/Header';
import { ReportCard } from './components/ReportCard';
import { MapPicker } from './components/MapPicker';
import { ReportFormModal } from './components/ReportFormModal';
import { ResolveReportModal } from './components/ResolveReportModal';
import { EvidenceGallery } from './components/EvidenceGallery';
import { ImpactDashboard } from './components/ImpactDashboard';
import { HowItWorksModal } from './components/HowItWorksModal';
import { WASTE_CATEGORIES_INFO } from './data/initialReports';
import { ORTEGA_CENTER } from './data/ortegaTolimaData';

export default function App() {
  const [reports, setReports] = useState<TrashReport[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('list');

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [reportToResolve, setReportToResolve] = useState<TrashReport | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | TrashReport['status']>('todos');
  const [wasteFilter, setWasteFilter] = useState<'todos' | WasteCategory>('todos');

  // Selected report on map
  const [selectedMapReport, setSelectedMapReport] = useState<TrashReport | null>(null);

  // Success notifications
  const [notification, setNotification] = useState<string | null>(null);

  // Load reports from storage on mount
  useEffect(() => {
    const loaded = getReports();
    setReports(loaded);
  }, []);

  const stats = useMemo(() => calculateStats(reports), [reports]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleCreateReport = (
    newReportData: Omit<TrashReport, 'id' | 'createdAt' | 'status' | 'upvotes'>
  ) => {
    const created = addReport(newReportData);
    setReports((prev) => [created, ...prev]);
    showNotification('¡Reporte registrado exitosamente! La comunidad ha sido notificada.');
  };

  const handleUpvote = (id: string) => {
    const updated = upvoteReport(id);
    setReports(updated);
  };

  const handleStatusChange = (id: string, newStatus: TrashReport['status']) => {
    const updated = updateReportStatus(id, newStatus);
    setReports(updated);
    showNotification(`Estado del reporte actualizado a: ${newStatus}`);
  };

  const handleResolveReport = (reportId: string, evidence: SolutionEvidence) => {
    const updated = resolveReportWithEvidence(reportId, evidence);
    setReports(updated);
    showNotification('¡Felicitaciones! Evidencia registrada y espacio marcado como limpio.');
  };

  const handleReset = () => {
    if (window.confirm('¿Deseas restablecer los reportes de prueba del Municipio de Ortega, Tolima?')) {
      const defaults = resetToDefaults();
      setReports(defaults);
      showNotification('Datos de prueba de Ortega, Tolima restablecidos.');
    }
  };

  const handleFocusMapReport = (report: TrashReport) => {
    setSelectedMapReport(report);
    setCurrentView('map');
  };

  // Filtered reports for list view
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      // Search query filter
      const matchesSearch =
        searchQuery.trim() === '' ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.location.referenceZone &&
          r.location.referenceZone.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status filter
      const matchesStatus = statusFilter === 'todos' || r.status === statusFilter;

      // Waste type filter
      const matchesWaste = wasteFilter === 'todos' || r.wasteType === wasteFilter;

      return matchesSearch && matchesStatus && matchesWaste;
    });
  }, [reports, searchQuery, statusFilter, wasteFilter]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 pb-20 md:pb-10 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* App Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenReportForm={() => setIsReportModalOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        pendingCount={stats.pendingReports}
        solvedCount={stats.resolvedReports}
        onResetData={handleReset}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-700 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-semibold">{notification}</p>
        </div>
      )}

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* VIEW 1: LISTADO DE REPORTES Y GESTIÓN */}
        {currentView === 'list' && (
          <div className="space-y-6">
            {/* Action Bar & Quick Overview Banner */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <TreePine className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Monitoreo Comunitario • Ortega, Tolima</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Reportes de Residuos en Espacios Públicos
                </h2>
                <p className="text-xs text-slate-500 max-w-xl">
                  Registra focos de basura con foto y coordenadas GPS. La comunidad y brigadas barriales se coordinan para intervenir y dejar constancia fotográfica de la solución.
                </p>
              </div>

              {/* Quick Step Indicators */}
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 text-xs self-stretch sm:self-auto justify-around">
                <div className="text-center px-3 py-1">
                  <span className="text-base font-extrabold text-amber-600 block">{stats.pendingReports}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Pendientes</span>
                </div>
                <div className="w-px h-7 bg-slate-200" />
                <div className="text-center px-3 py-1">
                  <span className="text-base font-extrabold text-sky-600 block">{stats.inProgressReports}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">En Gestión</span>
                </div>
                <div className="w-px h-7 bg-slate-200" />
                <div className="text-center px-3 py-1">
                  <span className="text-base font-extrabold text-emerald-600 block">{stats.resolvedReports}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">¡Limpios!</span>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search input */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por calle, barrio, parque o descripción..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                {/* Status toggle buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setStatusFilter('todos')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      statusFilter === 'todos'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Todos ({reports.length})
                  </button>

                  <button
                    onClick={() => setStatusFilter('pendiente')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      statusFilter === 'pendiente'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    Pendientes ({stats.pendingReports})
                  </button>

                  <button
                    onClick={() => setStatusFilter('en_proceso')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      statusFilter === 'en_proceso'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
                    }`}
                  >
                    En Gestión ({stats.inProgressReports})
                  </button>

                  <button
                    onClick={() => setStatusFilter('solucionado')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      statusFilter === 'solucionado'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    Limpios ({stats.resolvedReports})
                  </button>
                </div>
              </div>

              {/* Category chips filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1 shrink-0">
                  Tipo:
                </span>
                <button
                  onClick={() => setWasteFilter('todos')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition shrink-0 ${
                    wasteFilter === 'todos'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Cualquier material
                </button>
                {Object.entries(WASTE_CATEGORIES_INFO).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setWasteFilter(key as WasteCategory)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition shrink-0 ${
                      wasteFilter === key
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {info.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reports Grid */}
            {filteredReports.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto my-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  No hay reportes con este filtro
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  No se encontraron coincidencias para la búsqueda seleccionada. Puedes crear un nuevo reporte o limpiar los filtros.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('todos');
                      setWasteFilter('todos');
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Restablecer filtros
                  </button>
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow-md"
                  >
                    + Nuevo Reporte
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onUpvote={handleUpvote}
                    onOpenResolve={(rep) => setReportToResolve(rep)}
                    onStatusChange={handleStatusChange}
                    onFocusMap={handleFocusMapReport}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: MAPA INTERACTIVO DE CALVEMOR */}
        {currentView === 'map' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  <span>Cartografía Urbana y Red Vial</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Mapa del Municipio de Ortega (Tolima) y sus Calles
                </h2>
                <p className="text-xs text-slate-500">
                  Explora las calles, carreras y barrios de Ortega: Centro, Juan XXIII, San Fernando, Nueva Granada, El Prado, Nicolás Ramírez y la ronda del Río Ortega.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                Reportar en Ortega
              </button>
            </div>

            {/* Map Canvas and Selected Report Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MapPicker
                  currentLat={selectedMapReport?.location.lat || ORTEGA_CENTER.lat}
                  currentLng={selectedMapReport?.location.lng || ORTEGA_CENTER.lng}
                  reports={reports}
                  selectedReportId={selectedMapReport?.id}
                  onSelectReport={(rep) => setSelectedMapReport(rep)}
                  heightClass="h-[450px] sm:h-[580px]"
                />
              </div>

              {/* Sidebar with active pin detail */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center justify-between">
                  <span>Punto Seleccionado</span>
                  <span className="text-xs text-slate-500 font-normal">
                    {reports.length} reportes en el mapa
                  </span>
                </h3>

                {selectedMapReport ? (
                  <ReportCard
                    report={selectedMapReport}
                    onUpvote={handleUpvote}
                    onOpenResolve={(rep) => setReportToResolve(rep)}
                    onStatusChange={handleStatusChange}
                  />
                ) : (
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">
                      Toca un marcador en el mapa
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Haz clic sobre cualquier pin en el mapa para ver la fotografía de la basura, dirección, responsable y estado de limpieza.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: EVIDENCIAS ANTES / DESPUÉS Y TECNOLOGÍA */}
        {currentView === 'evidences' && (
          <EvidenceGallery
            reports={reports}
            onOpenReportForm={() => setIsReportModalOpen(true)}
          />
        )}

        {/* VIEW 4: IMPACTO AMBIENTAL Y CONCIENTIZACIÓN */}
        {currentView === 'impact' && (
          <ImpactDashboard
            stats={stats}
            reports={reports}
            onOpenReportForm={() => setIsReportModalOpen(true)}
          />
        )}
      </main>

      {/* Floating Bottom Action for Mobile */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 md:hidden">
        <button
          type="button"
          onClick={() => setIsReportModalOpen(true)}
          className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-2xl border-2 border-white ring-4 ring-emerald-600/30 transition active:scale-95"
        >
          <Camera className="w-4 h-4" />
          <span>¡Reportar Basura Ahora!</span>
        </button>
      </div>

      {/* Report Creation Modal */}
      <ReportFormModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleCreateReport}
      />

      {/* Resolve / Solution Evidence Modal */}
      <ResolveReportModal
        report={reportToResolve}
        isOpen={!!reportToResolve}
        onClose={() => setReportToResolve(null)}
        onResolve={handleResolveReport}
      />

      {/* How It Works Explainer Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onStartReport={() => setIsReportModalOpen(true)}
      />
    </div>
  );
}
