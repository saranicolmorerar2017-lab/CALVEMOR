import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  ThumbsUp,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { TrashReport } from '../types';
import { WASTE_CATEGORIES_INFO, SEVERITY_CONFIG, STATUS_CONFIG } from '../data/initialReports';

interface ReportCardProps {
  report: TrashReport;
  onUpvote: (id: string) => void;
  onOpenResolve: (report: TrashReport) => void;
  onStatusChange: (id: string, newStatus: TrashReport['status']) => void;
  onFocusMap?: (report: TrashReport) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onUpvote,
  onOpenResolve,
  onStatusChange,
  onFocusMap
}) => {
  const [showAfterPhoto, setShowAfterPhoto] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const categoryInfo = WASTE_CATEGORIES_INFO[report.wasteType] || {
    label: report.wasteType,
    color: 'text-slate-700',
    bg: 'bg-slate-100 border-slate-200'
  };

  const severityInfo = SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.media;
  const statusInfo = STATUS_CONFIG[report.status] || STATUS_CONFIG.pendiente;

  const handleVote = () => {
    if (!hasVoted) {
      onUpvote(report.id);
      setHasVoted(true);
    }
  };

  const formattedDate = new Date(report.createdAt).toLocaleDateString('es-CO', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const isResolved = report.status === 'solucionado' && report.solutionEvidence;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Media Viewport */}
      <div className="relative h-48 sm:h-52 w-full bg-slate-900 overflow-hidden">
        <img
          src={isResolved && showAfterPhoto ? report.solutionEvidence!.photoUrl : report.photoUrl}
          alt={report.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Badges Overlay Top */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-sm ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>

          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${severityInfo.color}`}
          >
            {severityInfo.label}
          </span>
        </div>

        {/* Before / After Toggle if resolved */}
        {isResolved && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
            <button
              type="button"
              onClick={() => setShowAfterPhoto(!showAfterPhoto)}
              className="px-3 py-1 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white text-[11px] font-semibold flex items-center gap-1.5 backdrop-blur-sm shadow-md transition"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>{showAfterPhoto ? 'Ver Antes (Basura)' : 'Ver Después (Limpio)'}</span>
            </button>

            <span className="text-[10px] bg-emerald-600/90 text-white px-2 py-0.5 rounded-full font-bold">
              {showAfterPhoto ? '✨ Espacio Recuperado' : '⚠️ Estado Inicial'}
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category Pill & Time */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
            <span
              className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-semibold ${categoryInfo.bg} ${categoryInfo.color}`}
            >
              {categoryInfo.label}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3 text-slate-400" />
              {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 leading-snug mb-1.5">
            {report.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {report.description}
          </p>

          {/* Location & Reference */}
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-2">
            <div className="flex items-start gap-1.5 text-xs text-slate-700 min-w-0">
              <MapPin className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <div className="min-w-0">
                <p className="font-semibold truncate">{report.location.address}</p>
                {report.location.referenceZone && (
                  <p className="text-[11px] text-slate-500 truncate">
                    Ref: {report.location.referenceZone}
                  </p>
                )}
              </div>
            </div>
            {onFocusMap && (
              <button
                type="button"
                onClick={() => onFocusMap(report)}
                className="shrink-0 text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
                title="Ver en el mapa interactivo"
              >
                Mapa <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Solution notes preview if resolved */}
          {report.solutionEvidence && (
            <div className="mt-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Solución por: {report.solutionEvidence.resolvedBy}</span>
              </div>
              <p className="text-[11px] text-emerald-800/90 leading-relaxed italic">
                "{report.solutionEvidence.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Reporter info & Upvote */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleVote}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                hasVoted
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Apoyar este reporte comunal"
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-emerald-600' : ''}`} />
              <span>{report.upvotes || 0}</span>
            </button>
            <span className="text-[11px] text-slate-400 truncate max-w-[120px]" title={report.reportedBy}>
              Por {report.reportedBy}
            </span>
          </div>

          {/* State / Clean Button */}
          <div>
            {report.status === 'solucionado' ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Resuelto
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                {report.status === 'pendiente' && (
                  <button
                    type="button"
                    onClick={() => onStatusChange(report.id, 'en_proceso')}
                    className="px-2.5 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 text-xs font-semibold transition"
                    title="Asignar brigada o marcar en gestión"
                  >
                    Tomar caso
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onOpenResolve(report)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition hover:scale-102"
                  title="Subir foto de evidencia y marcar como limpio"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Solucionar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
