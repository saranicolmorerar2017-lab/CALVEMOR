import React, { useState } from 'react';
import { CheckCircle2, Camera, X, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TrashReport, SolutionEvidence } from '../types';
import { CameraCaptureModal } from './CameraCaptureModal';

interface ResolveReportModalProps {
  report: TrashReport | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (reportId: string, evidence: SolutionEvidence) => void;
}

export const ResolveReportModal: React.FC<ResolveReportModalProps> = ({
  report,
  isOpen,
  onClose,
  onResolve
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [resolvedBy, setResolvedBy] = useState('');
  const [squadName, setSquadName] = useState('');
  const [notes, setNotes] = useState('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  if (!isOpen || !report) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) {
      setErrorNotice('Por favor añade una fotografía del lugar ya limpio como evidencia.');
      return;
    }
    if (!resolvedBy.trim()) {
      setErrorNotice('Indica quién o qué grupo llevó a cabo la limpieza.');
      return;
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    onResolve(report.id, {
      photoUrl,
      resolvedAt: new Date().toISOString(),
      resolvedBy: resolvedBy.trim(),
      squadName: squadName.trim() || 'Eco-Guardianes Voluntarios',
      notes: notes.trim() || 'Espacio público recuperado y libre de desechos.'
    });

    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-teal-700 to-emerald-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/15 backdrop-blur-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <h3 className="font-bold text-base">Registrar Solución y Evidencia</h3>
                <p className="text-xs text-emerald-100">Marcar reporte como Limpio</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorNotice && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorNotice}</span>
              </div>
            )}

            {/* Target Report preview */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <img
                src={report.photoUrl}
                alt={report.title}
                className="w-14 h-14 rounded-xl object-cover border border-slate-300"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                  Reporte a solucionar
                </span>
                <h4 className="text-xs font-bold text-slate-800 truncate">{report.title}</h4>
                <p className="text-[11px] text-slate-500 truncate">{report.location.address}</p>
              </div>
            </div>

            {/* Fotografía del Después */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Foto del Espacio Limpio (Evidencia Después)
              </label>

              {photoUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-emerald-300 h-44 bg-slate-900 group">
                  <img
                    src={photoUrl}
                    alt="Evidencia espacio limpio"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-white text-slate-800 font-medium text-xs shadow hover:bg-slate-100 transition flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-600" />
                      Cambiar foto
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="w-full border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-5 bg-emerald-50/40 hover:bg-emerald-50/70 transition flex flex-col items-center justify-center text-center group"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md mb-2 group-hover:scale-105 transition">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    Tomar foto del lugar limpio
                  </span>
                  <span className="text-[11px] text-slate-500">
                    La evidencia motiva y demuestra el compromiso comunal
                  </span>
                </button>
              )}
            </div>

            {/* Quién solucionó */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tu nombre o responsable
                </label>
                <input
                  type="text"
                  value={resolvedBy}
                  onChange={(e) => setResolvedBy(e.target.value)}
                  placeholder="Ej. Andrés Ramírez"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Brigada o colectivo (opcional)
                </label>
                <input
                  type="text"
                  value={squadName}
                  onChange={(e) => setSquadName(e.target.value)}
                  placeholder="Ej. Brigada Juvenil Calvemor"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Notas de la acción */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ¿Qué acciones se realizaron?
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Recolección de 3 costales de plástico, barrido y colocación de aviso ambiental."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-700/30 transition hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirmar Solución Comunitaria
              </button>
            </div>
          </form>
        </div>
      </div>

      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoCaptured={(photo) => {
          setPhotoUrl(photo);
          setErrorNotice(null);
        }}
      />
    </>
  );
};
