import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  MapPin,
  Database,
  Smartphone,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Layers,
  ArrowRight,
  Eye
} from 'lucide-react';
import { TrashReport } from '../types';

interface EvidenceGalleryProps {
  reports: TrashReport[];
  onOpenReportForm: () => void;
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({
  reports,
  onOpenReportForm
}) => {
  const [activeEvidenceTab, setActiveEvidenceTab] = useState<'cleanups' | 'system'>('cleanups');
  const [activeCompareId, setActiveCompareId] = useState<string | null>(null);

  const solvedReports = reports.filter((r) => r.status === 'solucionado' && r.solutionEvidence);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-emerald-850 via-teal-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold text-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            Evidencias de Impacto en Ortega, Tolima
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Transformaciones Antes y Después
          </h2>
          <p className="text-sm text-emerald-100/90 leading-relaxed mb-5">
            Cada reporte enviado por los vecinos se traduce en una acción concreta de limpieza y recuperación de nuestros espacios públicos. Aquí documentamos el funcionamiento de la app y las evidencias fotográficas de cada jornada.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveEvidenceTab('cleanups')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeEvidenceTab === 'cleanups'
                  ? 'bg-white text-emerald-900 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              🌱 Espacios Recuperados ({solvedReports.length})
            </button>
            <button
              onClick={() => setActiveEvidenceTab('system')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeEvidenceTab === 'system'
                  ? 'bg-white text-emerald-900 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              📱 Evidencias del Funcionamiento y Tecnología
            </button>
          </div>
        </div>

        {/* Decorative ambient ring */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/10 pointer-events-none blur-2xl" />
      </div>

      {/* Tab 1: Espacios Recuperados Antes y Después */}
      {activeEvidenceTab === 'cleanups' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Evidencias de Limpiezas Completadas
              </h3>
              <p className="text-xs text-slate-500">
                Comparativa directa entre el foco de basura reportado y el espacio recuperado
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {solvedReports.length} zonas restauradas
            </span>
          </div>

          {solvedReports.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center">
              <p className="text-slate-500 text-sm mb-4">
                Aún no hay reportes marcados con evidencia de solución final.
              </p>
              <button
                onClick={onOpenReportForm}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Crear primer reporte
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {solvedReports.map((report) => {
                const evidence = report.solutionEvidence!;
                return (
                  <div
                    key={report.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
                  >
                    {/* Header info */}
                    <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 mb-1.5">
                          <CheckCircle className="w-3.5 h-3.5" /> Caso Resuelto
                        </span>
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {report.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{report.location.address}</span>
                          {report.location.referenceZone && (
                            <span className="text-slate-400">({report.location.referenceZone})</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-bold text-slate-700 block">
                          {report.estimatedWeightKg ? `~${report.estimatedWeightKg} kg` : ''}
                        </span>
                        <span className="text-[10px] text-slate-400">retirados</span>
                      </div>
                    </div>

                    {/* Dual Before / After Image Grid */}
                    <div className="grid grid-cols-2 gap-0.5 bg-slate-100 border-b border-slate-100">
                      {/* Antes */}
                      <div className="relative h-48 sm:h-56 overflow-hidden group bg-slate-900">
                        <img
                          src={report.photoUrl}
                          alt="Antes de la limpieza"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2 bg-rose-600/90 backdrop-blur-sm text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                          Antes (Basura)
                        </div>
                      </div>

                      {/* Después */}
                      <div className="relative h-48 sm:h-56 overflow-hidden group bg-slate-900">
                        <img
                          src={evidence.photoUrl}
                          alt="Después de la limpieza"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                          Después (Limpio)
                        </div>
                      </div>
                    </div>

                    {/* Solution notes and brigade details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-slate-50/50">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            {evidence.squadName || 'Brigada Comunitaria'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(evidence.resolvedAt).toLocaleDateString('es-CO')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3 rounded-2xl border border-slate-200/80">
                          "{evidence.notes}"
                        </p>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                        <span>Reportado por: <strong>{report.reportedBy}</strong></span>
                        <span>Solucionado por: <strong>{evidence.resolvedBy}</strong></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Evidencias del Desarrollo y Funcionamiento Tecnológico */}
      {activeEvidenceTab === 'system' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Arquitectura y Funcionamiento Tecnológico
            </h3>
            <p className="text-xs text-slate-500">
              Demostración de los 5 componentes tecnológicos integrados para Eco-Guardianes en Ortega, Tolima
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Componente 1: Cámara */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Módulo 1: Cámara y Video
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1 mb-2">
                  Captura de Foto en Tiempo Real
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Acceso nativo a <code>navigator.mediaDevices.getUserMedia</code> para capturar la evidencia in situ con flash virtual, alternador de cámara frontal/trasera y selector de archivos.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 font-mono">
                Estado: Activo • API HTML5 Canvas
              </div>
            </div>

            {/* Componente 2: GPS / Ubicación */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
                  Módulo 2: GPS y Mapas
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1 mb-2">
                  Georreferenciación Exacta
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Geolocalización satelital con precisión métrica mediante la API de Geolocation del navegador y visor cartográfico interactivo Leaflet con OpenStreetMap de Ortega, Tolima.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 font-mono">
                Coordenadas Ortega: Lat 3.9361, Lng -75.2217
              </div>
            </div>

            {/* Componente 3: Base de Datos */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  Módulo 3: Base de Datos
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1 mb-2">
                  Persistencia y Ciclo de Vida
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Almacenamiento estructurado de reportes con esquema tipado: estados, pesos, fotos en base64/URL, votos comunitarios y evidencias de solución asociadas.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 font-mono">
                Storage: LocalStorage & Sync Ready
              </div>
            </div>

            {/* Componente 4: App Móvil Responsive */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                  Módulo 4: Experiencia Móvil
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1 mb-2">
                  Diseño UI Adaptativo Móvil
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Interfaz táctil optimizada para teléfonos y tablets, con botones de acceso rápido de más de 44px de área táctil, navegación inferior móvil y cards fluidas.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 font-mono">
                PWA / Touch ready • Tailwind CSS
              </div>
            </div>

            {/* Componente 5: Programación TypeScript */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                  Módulo 5: Programación TypeScript
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1 mb-2">
                  Lógica y Tipado Fuerte
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Desarrollo modular con React 19, cálculo de impacto ambiental automático, validaciones de formularios y manejo de eventos sin errores.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 font-mono">
                TypeScript 5.8 • React 19
              </div>
            </div>

            {/* Ciclo de Operación */}
            <div className="bg-emerald-900 text-white p-5 rounded-3xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  Flujo Completo del Usuario
                </span>
                <h4 className="text-base font-bold mt-1 mb-3">
                  5 Pasos del Funcionamiento
                </h4>
                <ol className="text-xs space-y-2 text-emerald-100">
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">1</span>
                    Identificar la acumulación de basura
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">2</span>
                    Tomar fotografía de evidencia
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">3</span>
                    Fijar ubicación por GPS en el mapa
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">4</span>
                    Enviar reporte a la comunidad
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">5</span>
                    Recepción y registro de solución
                  </li>
                </ol>
              </div>
              <button
                onClick={onOpenReportForm}
                className="mt-4 w-full py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition shadow"
              >
                Probar el Flujo Ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
