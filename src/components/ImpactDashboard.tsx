import React from 'react';
import {
  TreePine,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  Leaf,
  HeartHandshake,
  AlertCircle
} from 'lucide-react';
import { CommunityImpactStats, TrashReport } from '../types';
import { WASTE_CATEGORIES_INFO } from '../data/initialReports';

interface ImpactDashboardProps {
  stats: CommunityImpactStats;
  reports: TrashReport[];
  onOpenReportForm: () => void;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({
  stats,
  reports,
  onOpenReportForm
}) => {
  // Count by waste categories
  const wasteCounts = reports.reduce((acc, rep) => {
    acc[rep.wasteType] = (acc[rep.wasteType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const percentSolved = stats.totalReports > 0
    ? Math.round((stats.resolvedReports / stats.totalReports) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Hero Stat Header */}
      <div className="bg-gradient-to-br from-teal-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold text-emerald-200 mb-3">
            <TreePine className="w-3.5 h-3.5 text-emerald-300" />
            Impacto Ambiental y Comunitario • Ortega, Tolima
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Construyendo un Municipio Limpio y Sostenible
          </h2>
          <p className="text-sm text-emerald-100/90 max-w-2xl leading-relaxed mb-6">
            Gracias al compromiso de los habitantes y líderes de Ortega, cada reporte permite identificar focos críticos antes de que se conviertan en vertederos crónicos, protegiendo la salud, la cuenca del Río Ortega y el entorno público.
          </p>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <span className="text-xs text-emerald-200 font-medium block">Espacios Recuperados</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                {stats.publicSpacesRecovered}
              </span>
              <span className="text-[11px] text-emerald-200/80 mt-0.5 block">zonas limpias</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <span className="text-xs text-emerald-200 font-medium block">Residuos Retirados</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                {stats.estimatedWasteKgCleaned} <span className="text-sm font-normal">kg</span>
              </span>
              <span className="text-[11px] text-emerald-200/80 mt-0.5 block">evacuados a disposición</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <span className="text-xs text-emerald-200 font-medium block">Tasa de Resolución</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                {percentSolved}%
              </span>
              <span className="text-[11px] text-emerald-200/80 mt-0.5 block">{stats.resolvedReports} de {stats.totalReports} casos</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <span className="text-xs text-emerald-200 font-medium block">Eco-Guardianes</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                {stats.activeEcoGuardians}
              </span>
              <span className="text-[11px] text-emerald-200/80 mt-0.5 block">vecinos vigilantes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Estado de los Reportes
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Seguimiento del ciclo de atención en la comunidad
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Solucionados / Limpios
                  </span>
                  <span>{stats.resolvedReports}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(stats.resolvedReports / (stats.totalReports || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-sky-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> En Gestión / Brigada
                  </span>
                  <span>{stats.inProgressReports}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${(stats.inProgressReports / (stats.totalReports || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-700 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> Pendientes de Atención
                  </span>
                  <span>{stats.pendingReports}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(stats.pendingReports / (stats.totalReports || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Total registrados: <strong>{stats.totalReports}</strong></span>
            <button
              onClick={onOpenReportForm}
              className="text-emerald-700 font-bold hover:underline"
            >
              + Nuevo reporte
            </button>
          </div>
        </div>

        {/* Tipos de Residuos más frecuentes */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Frecuencia de Residuos en el Municipio de Ortega
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Distribución de problemáticas identificadas por los vecinos
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(WASTE_CATEGORIES_INFO).map(([key, info]) => {
                const count = wasteCounts[key] || 0;
                return (
                  <div
                    key={key}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${info.color.replace('text-', 'bg-')}`} />
                      <span className="text-xs font-semibold text-slate-800">{info.label}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                      {count} reportes
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>
              Los plásticos y escombros representan el 60% de los focos reportados en aceras y quebradas.
            </span>
          </div>
        </div>
      </div>

      {/* Campaña de Concientización y Educación Ambiental */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Guía de Conciencia y Prevención • Ortega, Tolima
            </h3>
            <p className="text-xs text-slate-500">
              Acciones sencillas para evitar que la basura vuelva a acumularse
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
              Horarios de Recolección
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Saca las bolsas de basura únicamente los días fijados por la empresa de aseo (Lunes, Miércoles y Viernes) 1 hora antes del paso del camión. No la dejes a la intemperie en la noche.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
              Escombros y Muebles Viejos
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              No contrates carretilleros informales que arrojan los residuos en lotes del barrio. Solicita el servicio especial de recolección de voluminosos al comité barrial.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
              Mascotas y Espacios Verdes
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recoge siempre las excretas de tus mascotas con bolsas biodegradables y deposítalas en los tachos autorizados del parque infantil y zonas peatonales.
            </p>
          </div>
        </div>

        {/* Community Commitment Callout */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-emerald-950">
            <HeartHandshake className="w-8 h-8 text-emerald-700 shrink-0" />
            <div>
              <h5 className="text-sm font-bold text-emerald-900">¿Quieres ser parte de la próxima brigada?</h5>
              <p className="text-xs text-emerald-800/90">
                Coordinamos limpiezas comunitarias quincenales para intervenir los puntos con más votos en la app.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenReportForm}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition shrink-0"
          >
            Reportar un Punto Crítico
          </button>
        </div>
      </div>
    </div>
  );
};
