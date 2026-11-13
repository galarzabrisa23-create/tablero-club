import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileSpreadsheet, 
  Lock, 
  Calendar, 
  RefreshCw,
  Scale
} from 'lucide-react';

export default function AuditModal({ isOpen, onClose, auditData, onReAudit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${auditData.isConsistent ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Auditoría de Cruzamiento de Planillas y Calidad de Datos
              </h3>
              <p className="text-xs text-slate-500">
                Verificación automática de reglas de negocio contables y administrativas (Grupo F - ITUNM).
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="cursor-pointer text-slate-400 hover:text-slate-600 text-base font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Resumen Global del Estado */}
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          auditData.isConsistent 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <div className="flex items-center gap-3">
            {auditData.isConsistent ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
            )}
            <div>
              <div className="font-bold text-sm">
                {auditData.isConsistent ? 'Estado General: 100% Consistente' : 'Inconsistencias Detectadas'}
              </div>
              <div className="text-xs opacity-90">
                {auditData.isConsistent 
                  ? 'Todas las planillas de Secretaría y Tesorería cuadran sin discrepancias ni deudas fantasmas.' 
                  : `Se hallaron ${auditData.totalErrors} errores en la validación cruzada.`}
              </div>
            </div>
          </div>
          <button
            onClick={onReAudit}
            className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            Revalidar
          </button>
        </div>

        {/* Lista de Controles / Reglas de Negocio */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Protocolo de Controles Ejecutados ({auditData.checks.length})
          </h4>

          {auditData.checks.map((check) => (
            <div 
              key={check.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3"
            >
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-500 text-[10px] bg-slate-200/80 px-1.5 py-0.5 rounded">
                    {check.id}
                  </span>
                  <span className="font-bold text-slate-900">
                    {check.titulo}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  {check.descripcion}
                </p>
                <div className="text-slate-700 font-medium bg-white p-2 rounded-lg border border-slate-200 mt-1">
                  {check.detalles}
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1 ${
                check.estado === 'PASSED' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                {check.estado === 'PASSED' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {check.estado === 'PASSED' ? 'Aprobado' : 'Fallo'}
              </span>
            </div>
          ))}
        </div>

        {/* Certificación Legal y Académica */}
        <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 flex items-center gap-2">
          <Scale className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            Verificación algorítmica conforme a las especificaciones del proyecto <strong>"Un tablero para el club"</strong> (ITUNM) y principios de la <strong>Ley 25.326</strong> de Protección de Datos Personales.
          </span>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Cerrar Informe
          </button>
        </div>

      </div>
    </div>
  );
}
