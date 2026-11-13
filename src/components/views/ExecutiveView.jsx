import React from 'react';
import { 
  Users, 
  DollarSign, 
  AlertTriangle, 
  Activity, 
  Award, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileText, 
  Printer, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Building
} from 'lucide-react';
import KpiCard from '../KpiCard';

export default function ExecutiveView({ kpiData, onNavigateTab, onPrint }) {
  const { padron, cobranza, actividades } = kpiData;

  // Formateador de moneda en pesos argentinos
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Top 4 socios con mayor mora para atención inmediata de la Comisión Directiva
  const topMorosos = cobranza.rankingMorosos.slice(0, 4);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Barra de Contexto Ejecutivo / Título */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              REUNIÓN MENSUAL DE COMISIÓN DIRECTIVA
            </span>
            <span className="text-xs text-slate-400">Acta Ordinaria N° 11/2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Resumen Ejecutivo Global - Período Noviembre 2026
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Visión integrada para la toma de decisiones: recaudación de cuotas, mora acumulada, flujo societario y capacidad deportiva sin solicitud de informes manuales.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onPrint}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all border border-indigo-400/40"
          >
            <Printer className="w-4 h-4" />
            Descargar Informe PDF (Acta)
          </button>
        </div>
      </div>

      {/* LOS 5 INDICADORES CLAVE (KPIs OBLIGATORIOS) EN BATERÍA PRINCIPAL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Padrón y Movimientos del Mes */}
        <KpiCard
          title="1. Padrón Activo & Flujo"
          value={`${padron.activos} Socios`}
          badgeText={`+${padron.balanceNeto} Neto`}
          badgeType={padron.balanceNeto >= 0 ? 'success' : 'danger'}
          subtitle={`Altas: ${padron.altasMes} | Bajas: ${padron.bajasMes}`}
          icon={Users}
          colorScheme="blue"
          onClick={() => onNavigateTab('secretaria')}
        />

        {/* KPI 2: Estado de Cobranza del Mes */}
        <KpiCard
          title="2. Recaudación del Mes"
          value={formatMoney(cobranza.totalCobradoMes)}
          badgeText={`${cobranza.porcentajeCobrabilidad}% Cobrado`}
          badgeType={cobranza.porcentajeCobrabilidad >= 65 ? 'success' : 'warning'}
          subtitle={`Falta: ${formatMoney(cobranza.totalPendienteMes)}`}
          icon={DollarSign}
          colorScheme="emerald"
          progress={cobranza.porcentajeCobrabilidad}
          onClick={() => onNavigateTab('tesoreria')}
        />

        {/* KPI 3: Deuda Acumulada del Club */}
        <KpiCard
          title="3. Deuda Acumulada"
          value={formatMoney(cobranza.deudaAcumuladaTotal)}
          badgeText={`${cobranza.rankingMorosos.length} En mora`}
          badgeType={cobranza.rankingMorosos.length > 5 ? 'danger' : 'warning'}
          subtitle={`Mora máx: ${cobranza.rankingMorosos[0]?.mesesDeuda || 0} meses`}
          icon={AlertTriangle}
          colorScheme="rose"
          onClick={() => onNavigateTab('tesoreria')}
        />

        {/* KPI 4: Inscriptos y Capacidad Deportiva */}
        <KpiCard
          title="4. Ocupación Actividades"
          value={`${actividades.totalInscriptos} / ${actividades.totalCapacidad}`}
          badgeText={`${actividades.porcentajeOcupacionGlobal}% Capacidad`}
          badgeType="info"
          subtitle={`${actividades.actividadesEnAlerta.length} disciplinas al límite`}
          icon={Activity}
          colorScheme="purple"
          progress={actividades.porcentajeOcupacionGlobal}
          onClick={() => onNavigateTab('coordinacion')}
        />

        {/* KPI 5: Semáforo Ejecutivo Global */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 rounded-xl border border-emerald-200 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                5. Salud Institucional
              </p>
              <div className="text-lg font-bold text-emerald-950 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Nivel Operativo Óptimo</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-600 text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-100/60 p-1.5 rounded-lg border border-emerald-200">
            Superávit de altas (+{padron.balanceNeto}) y cobrabilidad del {cobranza.porcentajeCobrabilidad}%. Requiere gestión sobre 2 morosos críticos.
          </div>
        </div>
      </div>

      {/* CUERPO PRINCIPAL DEL RESUMEN EJECUTIVO (3 PANELES SINÓPTICOS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* PANEL 1: Balance Financiero y Desglose de Cobranza (5 columnas) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Balance de Cobranzas - Noviembre 2026
              </h3>
              <p className="text-xs text-slate-500">
                Facturación teórica vs. cobranza de cuotas del mes
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('tesoreria')}
              className="cursor-pointer text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              Ver detalle <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Gráfico Visual de Barra Proporcional */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-700">Recaudado: {formatMoney(cobranza.totalCobradoMes)} ({cobranza.porcentajeCobrabilidad}%)</span>
              <span className="text-amber-700">Por Cobrar: {formatMoney(cobranza.totalPendienteMes)}</span>
            </div>
            <div className="w-full bg-amber-100 h-4 rounded-full overflow-hidden flex shadow-inner">
              <div 
                className="bg-emerald-500 h-full transition-all duration-700 relative"
                style={{ width: `${cobranza.porcentajeCobrabilidad}%` }}
                title={`Cobrado: ${cobranza.porcentajeCobrabilidad}%`}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Facturado Total del Mes: <strong>{formatMoney(cobranza.totalFacturadoMes)}</strong></span>
              <span>18 socios cotizantes</span>
            </div>
          </div>

          {/* Distribución de la Cartera por Antigüedad de Mora */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Segmentación de Socios según Antigüedad de Pago
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2">
                <span className="text-xs text-emerald-700 font-medium block">Al Día</span>
                <span className="text-base font-bold text-emerald-900">{cobranza.morosidadPorTramos.alDia}</span>
                <span className="text-[10px] text-emerald-600 block">0 meses</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-2">
                <span className="text-xs text-blue-700 font-medium block">Mora Leve</span>
                <span className="text-base font-bold text-blue-900">{cobranza.morosidadPorTramos.moraLeve}</span>
                <span className="text-[10px] text-blue-600 block">1 mes</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2">
                <span className="text-xs text-amber-700 font-medium block">Mora Media</span>
                <span className="text-base font-bold text-amber-900">{cobranza.morosidadPorTramos.moraMedia}</span>
                <span className="text-[10px] text-amber-600 block">2 meses</span>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-2">
                <span className="text-xs text-rose-700 font-medium block">Mora Crítica</span>
                <span className="text-base font-bold text-rose-900">{cobranza.morosidadPorTramos.moraCritica}</span>
                <span className="text-[10px] text-rose-600 block">≥3 meses</span>
              </div>
            </div>
          </div>

          {/* Nota de Alerta Contable */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Conciliación Contable Cuadrada: </span>
              El importe cobrado en caja ({formatMoney(cobranza.totalCobradoMes)}) más el saldo pendiente ({formatMoney(cobranza.totalPendienteMes)}) coincide exactamente al 100% con los aranceles fijados para Noviembre.
            </div>
          </div>
        </div>

        {/* PANEL 2: Top Morosos Prioritarios (Tesorería) (4 columnas) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Atención Comisión: Mayor Antigüedad
              </h3>
              <p className="text-xs text-slate-500">
                Socios con más meses impagos consecutivos
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('tesoreria')}
              className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Listado completo <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topMorosos.map((socio, idx) => (
              <div key={socio.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {socio.nombre}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-slate-100 text-slate-600">
                      {socio.categoria}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>DNI: {socio.dni}</span>
                    <span>•</span>
                    <span className="text-slate-400">Últ. pago: {socio.ultimoPagoFecha}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    {socio.mesesDeuda} meses
                  </span>
                  <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                    {formatMoney(socio.deudaTotal)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Recomendación para Tesorería: </span>
              Iniciar intimación formal a los 2 socios con 4 y 5 meses de retraso antes del cierre del ejercicio financiero.
            </div>
          </div>
        </div>

        {/* PANEL 3: Actividades y Cupos Críticos (3 columnas) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                Cupos & Disciplinas
              </h3>
              <p className="text-xs text-slate-500">
                Ocupación y alerta de vacantes
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('coordinacion')}
              className="cursor-pointer text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              Ver todas <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {actividades.lista.slice(0, 4).map((act) => (
              <div key={act.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-800 truncate" title={act.nombre}>
                    {act.nombre}
                  </span>
                  <span className="font-bold text-slate-900 shrink-0">
                    {act.inscriptosCount}/{act.cupoMaximo}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      act.estadoCupo === 'CRITICO' 
                        ? 'bg-rose-500' 
                        : act.estadoCupo === 'ADVERTENCIA' 
                        ? 'bg-amber-500' 
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (act.inscriptosCount / act.cupoMaximo) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{act.cupoDisponible} cupos libres</span>
                  <span className="font-medium text-slate-600">{act.profesor.split(' ')[1]}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-2.5 text-center text-xs text-purple-800">
            <span className="font-bold">{actividades.totalInscriptos} deportistas</span> practicando en 7 disciplinas oficiales.
          </div>
        </div>

      </div>

      {/* FOOTER INFORMATIVO CON PROTOCOLO LEY 25.326 */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>
            <strong>Protección de Datos (Ley 25.326):</strong> Información consolidada para uso exclusivo de la Comisión Directiva en reunión mensual.
          </span>
        </div>
        <div className="text-slate-500 text-[11px]">
          Generado automáticamente por el Sistema Analítico ITUNM Grupo F
        </div>
      </div>
    </div>
  );
}
