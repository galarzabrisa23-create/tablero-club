import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Printer, 
  FileCheck2, 
  Users, 
  DollarSign, 
  Calendar, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { CLUB_INFO } from '../data/mockData';
import { ROLE_PERMISSIONS } from '../services/dataConsistency';

export default function Header({ 
  currentRole, 
  setCurrentRole, 
  activeTab, 
  setActiveTab, 
  auditData, 
  onOpenAudit,
  onPrint 
}) {
  const currentRoleConfig = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.PRESIDENCIA;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      {/* Top Banner Institucional */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-wide text-white flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            {CLUB_INFO.name}
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-400">{CLUB_INFO.academicGroup}</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1 text-slate-300">
            <Calendar className="w-3 h-3 text-emerald-400" />
            {CLUB_INFO.period}
          </span>
          <span className="text-slate-500">|</span>
          <button 
            onClick={onOpenAudit}
            className={`cursor-pointer inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium transition-colors ${
              auditData.isConsistent 
                ? 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-800' 
                : 'bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-800'
            }`}
            title="Ver auditoría de cruzamiento de planillas"
          >
            <ShieldCheck className="w-3 h-3" />
            {auditData.isConsistent ? 'Planillas 100% Cruzadas y Consistentes' : `${auditData.totalErrors} Discrepancias`}
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-lg tracking-wider">
            MN
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight flex items-center gap-2">
              Tablero Analítico Integral
              <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                v1.0 MoSCoW
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Unificación centralizada de Padrón, Tesorería y Actividades Deportivas
            </p>
          </div>
        </div>

        {/* Controles de Rol y Exportación */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Selector de Rol (Simulación RBAC / Ley 25.326) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500 font-medium px-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Rol:
            </span>
            <select
              value={currentRole}
              onChange={(e) => {
                const newRole = e.target.value;
                setCurrentRole(newRole);
                // Si el rol no puede ver la tab activa, lo enviamos a su tab por defecto
                if (newRole === 'TESORERIA') setActiveTab('tesoreria');
                else if (newRole === 'SECRETARIA') setActiveTab('secretaria');
                else if (newRole === 'COORDINACION') setActiveTab('coordinacion');
                else if (newRole === 'PRESIDENCIA') setActiveTab('presidencia');
              }}
              className="text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
            >
              <option value="PRESIDENCIA">Comisión Directiva / Presidencia (Total)</option>
              <option value="TESORERIA">Tesorería & Cobranzas</option>
              <option value="SECRETARIA">Secretaría General</option>
              <option value="COORDINACION">Coordinación Deportiva (Ley 25.326)</option>
            </select>
          </div>

          {/* Botón de Exportar / Imprimir PDF para Acta */}
          <button
            onClick={onPrint}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Exportar resumen a formato PDF para adjuntar al acta mensual"
          >
            <Printer className="w-4 h-4" />
            <span>Exportar PDF / Acta</span>
          </button>
        </div>
      </div>

      {/* Barra de Navegación por Solapas / Vistas (4 Vistas MoSCoW) */}
      <div className="border-t border-slate-200 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 py-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('presidencia')}
              className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'presidencia'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              1. Resumen Ejecutivo (Comisión)
            </button>

            <button
              onClick={() => setActiveTab('tesoreria')}
              disabled={currentRole === 'COORDINACION'}
              className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                currentRole === 'COORDINACION'
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : activeTab === 'tesoreria'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
              title={currentRole === 'COORDINACION' ? 'Acceso restringido por Ley 25.326' : 'Ver tesorería'}
            >
              <DollarSign className="w-3.5 h-3.5" />
              2. Vista Tesorería (Mora & Cobranzas)
              {currentRole === 'COORDINACION' && <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded">Bloqueado</span>}
            </button>

            <button
              onClick={() => setActiveTab('secretaria')}
              className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'secretaria'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              3. Vista Secretaría (Padrón & Altas/Bajas)
            </button>

            <button
              onClick={() => setActiveTab('coordinacion')}
              className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'coordinacion'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              4. Vista Coordinación (Cupos & Actividades)
            </button>

            <button
              onClick={onOpenAudit}
              className="cursor-pointer ml-auto px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 flex items-center gap-1.5 border border-slate-300"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Auditoría de Planillas</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
