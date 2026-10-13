import React from 'react';
import {
  ShieldAlert,
  Plus,
  HelpCircle,
  MapPin,
  ListFilter,
  Sparkles,
  Search,
  CheckCircle2,
  TreePine,
  Layers,
  RotateCcw
} from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenReportForm: () => void;
  onOpenHowItWorks: () => void;
  pendingCount: number;
  solvedCount: number;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenReportForm,
  onOpenHowItWorks,
  pendingCount,
  solvedCount,
  onResetData
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewChange('list')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-none">
                  Eco-Guardianes
                </h1>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
                  Ortega • Tolima
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
                Municipio de Ortega, Tolima • Cuidando nuestras calles y espacios públicos
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/70 text-xs font-semibold">
            <button
              onClick={() => onViewChange('list')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                currentView === 'list'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5 text-emerald-600" />
              <span>Reportes</span>
              {pendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('map')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                currentView === 'map'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span>Mapa Barrial</span>
            </button>

            <button
              onClick={() => onViewChange('evidences')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                currentView === 'evidences'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Evidencias</span>
              {solvedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {solvedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('impact')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                currentView === 'impact'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Impacto</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenHowItWorks}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition text-xs font-semibold flex items-center gap-1.5"
              title="¿Cómo funciona el flujo de reporte?"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden lg:inline">Cómo funciona</span>
            </button>

            <button
              type="button"
              onClick={onOpenReportForm}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition hover:scale-102 active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Reportar Basura</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub Navigation bar */}
      <div className="md:hidden border-t border-slate-200/80 px-2 py-1.5 bg-slate-50 flex items-center justify-around text-xs font-medium">
        <button
          onClick={() => onViewChange('list')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
            currentView === 'list'
              ? 'bg-white text-emerald-700 font-bold shadow-xs'
              : 'text-slate-600'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Reportes</span>
        </button>

        <button
          onClick={() => onViewChange('map')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
            currentView === 'map'
              ? 'bg-white text-sky-700 font-bold shadow-xs'
              : 'text-slate-600'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Mapa</span>
        </button>

        <button
          onClick={() => onViewChange('evidences')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
            currentView === 'evidences'
              ? 'bg-white text-indigo-700 font-bold shadow-xs'
              : 'text-slate-600'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Evidencias</span>
        </button>

        <button
          onClick={() => onViewChange('impact')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
            currentView === 'impact'
              ? 'bg-white text-amber-700 font-bold shadow-xs'
              : 'text-slate-600'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Impacto</span>
        </button>
      </div>
    </header>
  );
};
