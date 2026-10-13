import React from 'react';
import {
  Eye,
  Camera,
  MapPin,
  Send,
  ShieldCheck,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartReport: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStartReport
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '1',
      icon: Eye,
      title: 'Identifica la basura',
      desc: 'Detecta cualquier acumulación de desechos, microbasural o contenedor desbordado en las calles, aceras o parques del Municipio de Ortega, Tolima.',
      color: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      num: '2',
      icon: Camera,
      title: 'Toma una foto',
      desc: 'Usa la cámara de tu teléfono o sube una imagen directa como evidencia clara del volumen y tipo de material acumulado.',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      num: '3',
      icon: MapPin,
      title: 'Registra la ubicación',
      desc: 'El sistema detecta tus coordenadas GPS automáticamente o puedes fijar el punto exacto sobre el mapa interactivo del barrio.',
      color: 'bg-sky-100 text-sky-800 border-sky-300'
    },
    {
      num: '4',
      icon: Send,
      title: 'Envía el reporte',
      desc: 'Indica la urgencia y descripción. El reporte se publica al instante en la base de datos comunal visible para todos los vecinos.',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    },
    {
      num: '5',
      icon: ShieldCheck,
      title: 'Se gestiona la solución',
      desc: 'El comité barrial o brigada municipal organiza la recolección, despeja la zona y sube la foto de evidencia del espacio limpio.',
      color: 'bg-teal-100 text-teal-800 border-teal-300'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">¿Cómo Funciona Eco-Guardianes?</h2>
              <p className="text-xs text-emerald-100">
                Paso a paso para reportar y recuperar espacios limpios
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition"
            aria-label="Cerrar modal de información"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="space-y-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/70 flex items-start gap-4 transition"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border ${step.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        Paso {step.num}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Transparencia total:</strong> Todas las fotos del antes y el después quedan registradas para que la comunidad pueda auditar los avances.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartReport();
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-700/20 transition hover:scale-102"
          >
            <span>Crear mi primer reporte</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
