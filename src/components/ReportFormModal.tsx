import React, { useState } from 'react';
import { Camera, MapPin, X, AlertTriangle, Send, Sparkles, User, Info, CheckCircle2 } from 'lucide-react';
import { WasteCategory, ReportSeverity, TrashReport } from '../types';
import { WASTE_CATEGORIES_INFO, SEVERITY_CONFIG } from '../data/initialReports';
import { CameraCaptureModal } from './CameraCaptureModal';
import { MapPicker } from './MapPicker';
import { ORTEGA_CENTER } from '../data/ortegaTolimaData';

interface ReportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: Omit<TrashReport, 'id' | 'createdAt' | 'status' | 'upvotes'>) => void;
}

export const ReportFormModal: React.FC<ReportFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [lat, setLat] = useState<number>(ORTEGA_CENTER.lat);
  const [lng, setLng] = useState<number>(ORTEGA_CENTER.lng);
  const [address, setAddress] = useState<string>('Carrera 5 con Calle 6, Parque Principal, Ortega (Tolima)');
  const [referenceZone, setReferenceZone] = useState<string>('Barrio Centro, Ortega');

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [wasteType, setWasteType] = useState<WasteCategory>('plastico_envases');
  const [severity, setSeverity] = useState<ReportSeverity>('media');
  const [reportedBy, setReportedBy] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [estimatedWeightKg, setEstimatedWeightKg] = useState<number>(30);

  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLocationChange = (newLat: number, newLng: number, addressSuggestion?: string) => {
    setLat(newLat);
    setLng(newLng);
    if (addressSuggestion) {
      setAddress(addressSuggestion);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) {
      setErrorNotice('Es indispensable adjuntar una fotografía de la acumulación de basura.');
      return;
    }
    if (!title.trim()) {
      setErrorNotice('Por favor indica un título breve para el reporte.');
      return;
    }
    if (!address.trim()) {
      setErrorNotice('Por favor confirma la ubicación o dirección del lugar.');
      return;
    }

    const reporterName = isAnonymous ? 'Guardián Anónimo' : reportedBy.trim() || 'Vecino de Ortega';

    onSubmit({
      title: title.trim(),
      description: description.trim() || 'Reporte de residuos en espacio público para limpieza comunitaria en Ortega, Tolima.',
      wasteType,
      severity,
      location: {
        lat,
        lng,
        address: address.trim(),
        referenceZone: referenceZone.trim() || 'Municipio de Ortega (Tolima)'
      },
      photoUrl,
      reportedBy: reporterName,
      estimatedWeightKg: Number(estimatedWeightKg) || 25
    });

    // Reset state & close
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 to-teal-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/15 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Nuevo Reporte en Ortega, Tolima</h2>
                <p className="text-xs text-emerald-100">
                  Eco-Guardianes • Municipio de Ortega, Tolima
                </p>
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

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {errorNotice && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorNotice}</span>
              </div>
            )}

            {/* Paso 1: Fotografía de Evidencia */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                    1
                  </span>
                  Fotografía del Lugar o Basura
                </label>
                {photoUrl && (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Foto lista
                  </span>
                )}
              </div>

              {photoUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 group h-48 sm:h-56 bg-slate-900">
                  <img
                    src={photoUrl}
                    alt="Evidencia fotográfica"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="px-4 py-2 rounded-xl bg-white text-slate-800 font-medium text-xs shadow-lg hover:bg-slate-100 transition flex items-center gap-1.5"
                    >
                      <Camera className="w-4 h-4 text-emerald-600" />
                      Cambiar foto
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsCameraOpen(true)}
                  className="cursor-pointer border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-6 bg-emerald-50/40 hover:bg-emerald-50/70 transition flex flex-col items-center justify-center text-center group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 group-hover:scale-105 text-white flex items-center justify-center shadow-lg shadow-emerald-700/20 transition mb-3">
                    <Camera className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">
                    Toma una foto con tu cámara o selecciona una imagen
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Ayúdanos a dimensionar el problema para coordinar la brigada y herramientas necesarias.
                  </p>
                </div>
              )}
            </div>

            {/* Paso 2: Ubicación Geográfica */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                    2
                  </span>
                  Ubicación en Ortega, Tolima
                </label>
                <span className="text-[11px] text-slate-500">
                  Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
                </span>
              </div>

              <div className="space-y-3">
                <MapPicker
                  currentLat={lat}
                  currentLng={lng}
                  onLocationChange={handleLocationChange}
                  interactiveSelect={true}
                  heightClass="h-48 sm:h-56"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Dirección aproximada, calle o carrera
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ej. Carrera 5 con Calle 6, Parque Principal"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Barrio o punto de referencia en Ortega
                    </label>
                    <input
                      type="text"
                      value={referenceZone}
                      onChange={(e) => setReferenceZone(e.target.value)}
                      placeholder="Ej. Barrio Centro, Barrio Juan XXIII, cerca a la Alcaldía"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Paso 3: Detalles y Clasificación */}
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                  3
                </span>
                Detalles del Residuos
              </label>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Título del problema
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Basura acumulada frente al parque infantil"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Categorías de residuos */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">
                  Tipo de residuo principal
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(WASTE_CATEGORIES_INFO).map(([key, info]) => {
                    const isSelected = wasteType === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setWasteType(key as WasteCategory)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition flex flex-col gap-1 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-[11px]">{info.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nivel de Gravedad */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">
                  Nivel de urgencia / volumen
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(SEVERITY_CONFIG).map(([key, conf]) => {
                    const isSelected = severity === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSeverity(key as ReportSeverity)}
                        className={`p-2 rounded-xl border text-center text-xs transition flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-sm'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${conf.dot}`} />
                        <span>{conf.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Descripción adicional */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Descripción y observaciones (opcional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles sobre olores, riesgo para transeúntes, presencia de animales, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* Datos del Guardián */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>¿Quién reporta?</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-slate-600">Reportar de forma anónima</span>
                  </label>
                </div>

                {!isAnonymous && (
                  <div>
                    <input
                      type="text"
                      value={reportedBy}
                      onChange={(e) => setReportedBy(e.target.value)}
                      placeholder="Tu nombre o seudónimo de guardián (Ej. María Gómez)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer Submit */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-700/30 transition hover:scale-[1.02]"
              >
                <Send className="w-4 h-4" />
                Enviar Reporte a la Comunidad
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Camera Capture Sub-Modal */}
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
