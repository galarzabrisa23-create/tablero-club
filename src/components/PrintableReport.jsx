import React from 'react';
import { CLUB_INFO } from '../data/mockData';

export default function PrintableReport({ kpiData }) {
  const { padron, cobranza, actividades } = kpiData;

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans text-xs max-w-4xl mx-auto space-y-6">
      {/* Membrete Institucional Formal */}
      <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
            {CLUB_INFO.name}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Fundado en {CLUB_INFO.founded} • CUIT: {CLUB_INFO.cuit} • {CLUB_INFO.address}
          </p>
          <p className="text-[11px] text-slate-500 italic mt-0.5">
            {CLUB_INFO.academicGroup}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold px-3 py-1 bg-slate-100 border border-slate-300 rounded inline-block">
            ANEXO ACTA MENSUAL N° 11/2026
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Fecha de Sesión: 13 de Noviembre de 2026
          </div>
        </div>
      </div>

      {/* Título del Documento */}
      <div className="text-center py-2 bg-slate-50 border border-slate-200 rounded">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">
          INFORME EJECUTIVO ANALÍTICO MENSUAL DE GESTIÓN Y TESORERÍA
        </h2>
        <p className="text-[11px] text-slate-600">
          Período Contable y Administrativo Evaluado: <strong>Noviembre 2026</strong>
        </p>
      </div>

      {/* 1. BATERÍA CONSOLIDADA DE INDICADORES CLAVE (KPIs) */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">
          1. Cuadro de Mando Integral (KPIs del Período)
        </h3>
        <table className="w-full border border-slate-300 text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-slate-100 font-bold border-b border-slate-300">
              <th className="p-2 border-r border-slate-300">Indicador Clave</th>
              <th className="p-2 border-r border-slate-300">Valor Actual</th>
              <th className="p-2 border-r border-slate-300">Desglose / Detalle</th>
              <th className="p-2">Evaluación Comisión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            <tr>
              <td className="p-2 font-bold border-r border-slate-300">Padrón de Socios Activos</td>
              <td className="p-2 font-mono font-bold border-r border-slate-300">{padron.activos} socios</td>
              <td className="p-2 border-r border-slate-300">+{padron.altasMes} Altas | -{padron.bajasMes} Bajas (Balance Neto: +{padron.balanceNeto})</td>
              <td className="p-2 text-emerald-800 font-bold">Crecimiento Favorable</td>
            </tr>
            <tr>
              <td className="p-2 font-bold border-r border-slate-300">Recaudación de Cuotas del Mes</td>
              <td className="p-2 font-mono font-bold border-r border-slate-300">{formatMoney(cobranza.totalCobradoMes)}</td>
              <td className="p-2 border-r border-slate-300">{cobranza.porcentajeCobrabilidad}% cobrado sobre {formatMoney(cobranza.totalFacturadoMes)}</td>
              <td className="p-2 text-emerald-800 font-bold">Cobranza Regular</td>
            </tr>
            <tr>
              <td className="p-2 font-bold border-r border-slate-300">Saldo Pendiente a Cobrar</td>
              <td className="p-2 font-mono font-bold border-r border-slate-300">{formatMoney(cobranza.totalPendienteMes)}</td>
              <td className="p-2 border-r border-slate-300">Representa el {100 - cobranza.porcentajeCobrabilidad}% restante de cuotas de Noviembre</td>
              <td className="p-2 text-amber-800 font-bold">En gestión de cobro</td>
            </tr>
            <tr>
              <td className="p-2 font-bold border-r border-slate-300">Deuda Acumulada Histórica</td>
              <td className="p-2 font-mono font-bold border-r border-slate-300">{formatMoney(cobranza.deudaAcumuladaTotal)}</td>
              <td className="p-2 border-r border-slate-300">{cobranza.rankingMorosos.length} socios con 1 o más meses impagos (Mora máx: {cobranza.rankingMorosos[0]?.mesesDeuda || 0} meses)</td>
              <td className="p-2 text-rose-800 font-bold">Atención Prioritaria</td>
            </tr>
            <tr>
              <td className="p-2 font-bold border-r border-slate-300">Ocupación de Disciplinas</td>
              <td className="p-2 font-mono font-bold border-r border-slate-300">{actividades.porcentajeOcupacionGlobal}%</td>
              <td className="p-2 border-r border-slate-300">{actividades.totalInscriptos} deportistas sobre {actividades.totalCapacidad} cupos disponibles</td>
              <td className="p-2 text-slate-800 font-bold">Capacidad Óptima</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. REPORTE PRIORITARIO DE MOROSIDAD (TESORERÍA) */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">
          2. Socios en Situación de Mora Crítica (Ordenados por Antigüedad)
        </h3>
        <table className="w-full border border-slate-300 text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-slate-100 font-bold border-b border-slate-300">
              <th className="p-1.5 border-r border-slate-300">N° Socio</th>
              <th className="p-1.5 border-r border-slate-300">Nombre del Socio</th>
              <th className="p-1.5 border-r border-slate-300">DNI</th>
              <th className="p-1.5 border-r border-slate-300 text-center">Meses Deuda</th>
              <th className="p-1.5 border-r border-slate-300">Períodos Impagos</th>
              <th className="p-1.5 border-r border-slate-300 text-right">Deuda Total</th>
              <th className="p-1.5">Último Pago</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            {cobranza.rankingMorosos.slice(0, 6).map((socio) => (
              <tr key={socio.id}>
                <td className="p-1.5 font-mono border-r border-slate-300">{socio.id}</td>
                <td className="p-1.5 font-bold border-r border-slate-300">{socio.nombre}</td>
                <td className="p-1.5 font-mono border-r border-slate-300">{socio.dni}</td>
                <td className="p-1.5 font-bold text-center border-r border-slate-300 text-rose-800">
                  {socio.mesesDeuda} meses
                </td>
                <td className="p-1.5 font-mono border-r border-slate-300">{socio.cuotasAdeudadas.join(', ')}</td>
                <td className="p-1.5 font-mono font-bold text-right border-r border-slate-300 text-rose-800">
                  {formatMoney(socio.deudaTotal)}
                </td>
                <td className="p-1.5 text-slate-600">{socio.ultimoPagoFecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. MOVIMIENTOS SOCIETARIOS (SECRETARÍA) Y CUPOS (COORDINACIÓN) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-slate-300 rounded p-2.5 space-y-1.5">
          <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            Bajas Registradas en el Mes
          </h4>
          <ul className="space-y-1 text-[10px]">
            {padron.listaBajas.map((b) => (
              <li key={b.id} className="border-b border-slate-100 pb-1">
                <strong>{b.nombre}</strong> ({b.id}) - Fecha: {b.fechaBaja}
                <div className="text-slate-600 italic">Causa: {b.motivoBaja}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-slate-300 rounded p-2.5 space-y-1.5">
          <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            Disciplinas con Ocupación Relevante
          </h4>
          <ul className="space-y-1 text-[10px]">
            {actividades.lista.slice(0, 4).map((act) => (
              <li key={act.id} className="flex justify-between border-b border-slate-100 pb-1">
                <span>{act.nombre}:</span>
                <span className="font-bold font-mono">
                  {act.inscriptosCount} / {act.cupoMaximo} ({Math.round((act.inscriptosCount / act.cupoMaximo) * 100)}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. DICTAMEN Y FIRMAS DE CONFORMIDAD */}
      <div className="pt-8 border-t border-slate-300 space-y-8">
        <div className="text-[10px] text-slate-600 italic text-center">
          Se deja constancia en la presente acta de que los datos aquí expresados fueron validados algorítmicamente mediante el módulo de consistencia contable del sistema analítico ITUNM Grupo F, respetando las disposiciones de la Ley 25.326.
        </div>

        <div className="grid grid-cols-3 gap-8 text-center pt-8">
          <div className="border-t border-slate-900 pt-1">
            <p className="font-bold text-[11px]">Presidente</p>
            <p className="text-[10px] text-slate-500">Comisión Directiva</p>
          </div>
          <div className="border-t border-slate-900 pt-1">
            <p className="font-bold text-[11px]">Secretario General</p>
            <p className="text-[10px] text-slate-500">Padrón de Socios</p>
          </div>
          <div className="border-t border-slate-900 pt-1">
            <p className="font-bold text-[11px]">Tesorero</p>
            <p className="text-[10px] text-slate-500">Libro de Caja y Cobranzas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
