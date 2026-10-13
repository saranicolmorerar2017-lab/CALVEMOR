import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Upload, Check, AlertCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured: (base64Photo: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onPhotoCaptured
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && !capturedPhoto) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, capturedPhoto]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const startCamera = async () => {
    setIsLoading(true);
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('La API de cámara no es compatible con este navegador.');
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play().catch((err) => {
          console.warn('Video play error:', err);
        });
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      let message = 'No se pudo acceder a la cámara en vivo. Puedes subir una foto desde tu galería o dispositivo.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Permiso de cámara denegado. Puedes habilitarlo en los permisos del navegador o seleccionar un archivo.';
      }
      setCameraError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flash effect
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhoto(dataUrl);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCapturedPhoto(result);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  const confirmPhoto = () => {
    if (capturedPhoto) {
      onPhotoCaptured(capturedPhoto);
      onClose();
      setCapturedPhoto(null);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 text-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-base text-slate-100">
              {capturedPhoto ? 'Revisar Fotografía' : 'Tomar Foto de Evidencia'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Cerrar cámara"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[380px] bg-black flex items-center justify-center overflow-hidden">
          {isFlashing && (
            <div className="absolute inset-0 bg-white z-30 transition-opacity duration-150" />
          )}

          {capturedPhoto ? (
            <img
              src={capturedPhoto}
              alt="Foto capturada"
              className="w-full h-full object-contain max-h-[55vh]"
            />
          ) : (
            <>
              {cameraError ? (
                <div className="p-6 text-center max-w-sm flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-slate-300 mb-4">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition shadow-lg"
                  >
                    <Upload className="w-4 h-4" />
                    Subir foto desde archivo
                  </button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {/* Guidelines framing overlay */}
          {!capturedPhoto && !cameraError && (
            <div className="absolute inset-6 pointer-events-none border border-emerald-400/40 rounded-xl flex flex-col justify-between p-3">
              <span className="text-[11px] font-medium text-emerald-300/80 bg-black/50 px-2 py-0.5 rounded self-start">
                Enfoca la acumulación de basura
              </span>
              <span className="text-[11px] font-medium text-emerald-300/80 bg-black/50 px-2 py-0.5 rounded self-end">
                Eco-Guardianes Ortega (Tolima)
              </span>
            </div>
          )}
        </div>

        {/* Controls Bar */}
        <div className="px-5 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          {capturedPhoto ? (
            <>
              <button
                type="button"
                onClick={retakePhoto}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Repetir Foto
              </button>
              <button
                type="button"
                onClick={confirmPhoto}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/40"
              >
                <Check className="w-4 h-4" />
                Usar esta Foto
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                title="Seleccionar foto existente"
              >
                <Upload className="w-5 h-5" />
              </button>

              {!cameraError && (
                <button
                  type="button"
                  onClick={capturePhoto}
                  disabled={isLoading}
                  className="w-16 h-16 rounded-full border-4 border-emerald-400 bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center transition shadow-lg hover:scale-105 active:scale-95 mx-auto"
                  aria-label="Disparar captura de foto"
                >
                  <div className="w-10 h-10 rounded-full bg-white/30" />
                </button>
              )}

              {!cameraError && (
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  className="p-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                  title="Cambiar entre cámara frontal y trasera"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
};
