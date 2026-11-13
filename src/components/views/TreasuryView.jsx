import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  AlertTriangle, 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  FileText, 
  CreditCard,
  Building2,
  Calendar,
  Receipt,
  Download
} from 'lucide-react';
import KpiCard from '../KpiCard';

export default function TreasuryView({ kpiData }) {
  const { cobranza, padron } = kpiData;
  const [searchTerm, setSearchTerm] = useState('');
  const [moraFilter, setMoraFilter] = useState('ALL'); // 'ALL', 'MORA_CRITICA', 'MORA_MEDIA', 'MORA_LEVE', 'AL_DIA'
  const [sortBy, setSortBy] = useState('DEUDA_ANTIGUEDAD'); // 'DEUDA_ANTIGUEDAD', 'DEUDA_MONTO', 'NOMBRE'
  const [selectedSocio, setSelectedSocio] = useState(null);
  const [notification, setNotification] = useState(null);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filtrado y ordenamiento de socios para Tesorería
  const filteredSocios = useMemo(() => {
    return cobranza.todosSociosCobranza
      .filter((s) => {
        // Búsqueda por nombre o DNI
        const matchesSearch = 
          s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.dni.includes(searchTerm) ||
          s.id.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        // Filtro por tramo de mora
        if (moraFilter === 'MORA_CRITICA') return s.mesesDeuda >= 3;
        if (moraFilter === 'MORA_MEDIA') return s.mesesDeuda === 2;
        if (moraFilter === 'MORA_LEVE') return s.mesesDeuda === 1;
        if (moraFilter === 'AL_DIA') return s.mesesDeuda === 0;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'DEUDA_ANTIGUEDAD') {
          // Primero quien debe hace más tiempo (antigüedad de deuda descendente)
          if (b.mesesDeuda !== a.mesesDeuda) return b.mesesDeuda - a.mesesDeuda;
          return b.deudaTotal - a.deudaTotal;
        }
        if (sortBy === 'DEUDA_MONTO') {
          return b.deudaTotal - a.deudaTotal;
        }
        if (sortBy === 'NOMBRE') {
          return a.nombre.localeCompare(b.nombre);
        }
        return 0;
      });
  }, [cobranza.todosSociosCobranza, searchTerm, moraFilter, sortBy]);

  // Simulación de acción de cobranza
  const handleSimulatePayment = (socio) => {
    setNotification(`Cobro de cuota registrado para ${socio.nombre}. Recibo REC-2026-${Math.floor(1000 + Math.random() * 9000)} emitido.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Banner de notificación interactiva */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 font-bold hover:underline">
            Cerrar
          </button>
        </div>
      )}

      {/* KPIs DE TESORERÍA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Facturación del Mes"
          value={formatMoney(cobranza.totalFacturadoMes)}
          subtitle="Total devengado en cuotas Nov-2026"
          badgeText="18 socios cotizantes"
          badgeType="neutral"
          icon={Receipt}
          colorScheme="blue"
        />

        <KpiCard
          title="Total Recaudado (Caja)"
          value={formatMoney(cobranza.totalCobradoMes)}
          subtitle={`${cobranza.porcentajeCobrabilidad}% cobrado a la fecha`}
          badgeText="Fondos disponibles"
          badgeType="success"
          icon={DollarSign}
          colorScheme="emerald"
          progress={cobranza.porcentajeCobrabilidad}
        />

        <KpiCard
          title="Saldo a Recaudar (Mes)"
          value={formatMoney(cobranza.totalPendienteMes)}
          subtitle="Cuotas de Noviembre pendientes"
          badgeText={`${100 - cobranza.porcentajeCobrabilidad}% restante`}
          badgeType="warning"
          icon={Clock}
          colorScheme="amber"
        />

        <KpiCard
          title="Deuda Histórica Total"
          value={formatMoney(cobranza.deudaAcumuladaTotal)}
          subtitle={`En mora: ${cobranza.rankingMorosos.length} socios`}
          badgeText={`Máx: ${cobranza.rankingMorosos[0]?.mesesDeuda || 0} meses`}
          badgeType="danger"
          icon={AlertTriangle}
          colorScheme="rose"
        />
      </div>

      {/* PANEL PRINCIPAL: TABLA DE SOCIOS ORDENADOS POR ANTIGÜEDAD DE DEUDA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Controles de Filtros y Búsqueda */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Gestión de Cobranzas y Antigüedad de Deuda
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Listado ordenado prioritariamente por antigüedad de la deuda (quién debe hace más tiempo primero).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Buscador */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar socio por nombre, DNI o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Selector de Tramo de Mora */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={moraFilter}
                onChange={(e) => setMoraFilter(e.target.value)}
                className="font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="ALL">Todos los estados ({cobranza.todosSociosCobranza.length})</option>
                <option value="MORA_CRITICA">Mora Crítica (≥ 3 meses)</option>
                <option value="MORA_MEDIA">Mora Media (2 meses)</option>
                <option value="MORA_LEVE">Mora Leve (1 mes)</option>
                <option value="AL_DIA">Al Día (0 meses)</option>
              </select>
            </div>

            {/* Criterio de Ordenamiento */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="DEUDA_ANTIGUEDAD">Antigüedad Deuda (Mayor a Menor)</option>
                <option value="DEUDA_MONTO">Monto Deuda (Mayor a Menor)</option>
                <option value="NOMBRE">Alfabético por Nombre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Socios */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <th className="py-3 px-4">Prioridad / Socio</th>
                <th className="py-3 px-3">Categoría</th>
                <th className="py-3 px-3">Cuota Mes</th>
                <th className="py-3 px-3 text-center">Antigüedad (Meses)</th>
                <th className="py-3 px-3">Períodos Adeudados</th>
                <th className="py-3 px-3 text-right">Deuda Total</th>
                <th className="py-3 px-3">Último Pago</th>
                <th className="py-3 px-3">Comprobante</th>
                <th className="py-3 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredSocios.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-500">
                    No se encontraron socios que coincidan con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredSocios.map((socio, index) => {
                  const isVitalicio = socio.categoria === 'VITALICIO';
                  return (
                    <tr 
                      key={socio.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        socio.mesesDeuda >= 3 ? 'bg-rose-50/40' : socio.mesesDeuda > 0 ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* Socio / Prioridad */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            socio.mesesDeuda >= 3 
                              ? 'bg-rose-600 text-white' 
                              : socio.mesesDeuda > 0 
                              ? 'bg-amber-500 text-white' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {index + 1}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900">{socio.nombre}</div>
                            <div className="text-[11px] text-slate-400">
                              {socio.id} • DNI {socio.dni}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                          socio.categoria === 'ACTIVO'
                            ? 'bg-blue-100 text-blue-800'
                            : socio.categoria === 'CADETE'
                            ? 'bg-sky-100 text-sky-800'
                            : socio.categoria === 'INFANTIL'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {socio.categoria}
                        </span>
                      </td>

                      {/* Cuota Arancel */}
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {isVitalicio ? <span className="text-slate-400 italic">Exento ($0)</span> : formatMoney(socio.feeMensual)}
                      </td>

                      {/* Antigüedad de la Deuda */}
                      <td className="py-3 px-3 text-center">
                        {socio.mesesDeuda === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Al Día (0)
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                            socio.mesesDeuda >= 3
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : socio.mesesDeuda === 2
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            <Clock className="w-3 h-3" />
                            {socio.mesesDeuda} {socio.mesesDeuda === 1 ? 'mes' : 'meses'}
                          </span>
                        )}
                      </td>

                      {/* Cuotas Adeudadas (lista) */}
                      <td className="py-3 px-3">
                        {socio.cuotasAdeudadas.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {socio.cuotasAdeudadas.map(cuota => (
                              <span key={cuota} className="px-1.5 py-0.2 rounded bg-rose-100/80 text-rose-800 font-mono text-[10px]">
                                {cuota}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-emerald-600 font-medium text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Sin cuotas pendientes
                          </span>
                        )}
                      </td>

                      {/* Deuda Total Acumulada */}
                      <td className="py-3 px-3 text-right">
                        <span className={`font-extrabold text-sm ${
                          socio.deudaTotal > 0 ? 'text-rose-600' : 'text-slate-400'
                        }`}>
                          {formatMoney(socio.deudaTotal)}
                        </span>
                      </td>

                      {/* Último Pago Registrado */}
                      <td className="py-3 px-3 text-[11px]">
                        <div className="font-medium text-slate-800">{socio.ultimoPagoFecha}</div>
                        <div className="text-slate-400">{socio.metodoPago}</div>
                      </td>

                      {/* Comprobante Recibo */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                        {socio.comprobanteRecibo}
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4 text-center">
                        {socio.mesesDeuda > 0 ? (
                          <button
                            onClick={() => handleSimulatePayment(socio)}
                            className="cursor-pointer px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded text-[11px] shadow-xs transition-colors"
                            title="Registrar cobro de cuota"
                          >
                            Cobrar
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer de la Tabla con Resumen Contable */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-4">
            <span>Mostrando <strong>{filteredSocios.length}</strong> de <strong>{cobranza.todosSociosCobranza.length}</strong> socios</span>
            <span className="text-slate-300">|</span>
            <span className="text-rose-700 font-bold">Total Cartera en Mora: {formatMoney(cobranza.deudaAcumuladaTotal)}</span>
          </div>

          <div className="text-slate-500 flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-blue-600" />
            Trazabilidad respaldada por recibos correlativos de tesorería
          </div>
        </div>
      </div>
    </div>
  );
}
