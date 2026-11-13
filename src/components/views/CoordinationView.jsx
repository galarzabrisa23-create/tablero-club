import React, { useState } from 'react';
import { 
  Activity, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  User, 
  ShieldCheck, 
  Lock,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';
import KpiCard from '../KpiCard';

export default function CoordinationView({ kpiData }) {
  const { actividades } = kpiData;
  const [expandedActivityId, setExpandedActivityId] = useState('ACT-01'); // Primer actividad abierta por defecto
  const [filterCupo, setFilterCupo] = useState('ALL'); // 'ALL', 'CRITICO', 'DISPONIBLE'
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpand = (id) => {
    setExpandedActivityId(expandedActivityId === id ? null : id);
  };

  const filteredActividades = actividades.lista.filter((act) => {
    const matchesSearch = 
      act.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.profesor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.lugar.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterCupo === 'CRITICO' && act.estadoCupo === 'DISPONIBLE') return false;
    if (filterCupo === 'DISPONIBLE' && act.estadoCupo !== 'DISPONIBLE') return false;

    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* AVISO INSTITUCIONAL DE CUMPLIMIENTO LEY 25.326 */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-amber-900 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-200 text-amber-800 rounded-lg">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold">Minimización de Datos Personales (Ley 25.326): </span>
            El rol Coordinación Deportiva visualiza exclusivamente información logística, deportiva y aptos médicos. Las deudas y cuentas corrientes están restringidas a Tesorería.
          </div>
        </div>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-800">
          RBAC Activo
        </span>
      </div>

      {/* KPIS DE COORDINACIÓN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Ocupación Total Deportiva"
          value={`${actividades.porcentajeOcupacionGlobal}%`}
          subtitle={`${actividades.totalInscriptos} deportistas activos`}
          badgeText={`Capacidad: ${actividades.totalCapacidad}`}
          badgeType="info"
          icon={Activity}
          colorScheme="purple"
          progress={actividades.porcentajeOcupacionGlobal}
        />

        <KpiCard
          title="Disciplinas Oficiales"
          value={`${actividades.lista.length} Actividades`}
          subtitle="Con docentes a cargo"
          badgeText="7 espacios deportivos"
          badgeType="neutral"
          icon={Users}
          colorScheme="blue"
        />

        <KpiCard
          title="Disciplinas en Alerta"
          value={`${actividades.actividadesEnAlerta.length} Al límite`}
          subtitle="Superan el 70% del cupo"
          badgeText="Atención a lista de espera"
          badgeType={actividades.actividadesEnAlerta.length > 0 ? 'warning' : 'success'}
          icon={AlertCircle}
          colorScheme="amber"
        />

        <KpiCard
          title="Vacantes Disponibles"
          value={`${actividades.totalCapacidad - actividades.totalInscriptos} Cupos`}
          subtitle="Disponibilidad global en el club"
          badgeText="Inscripciones abiertas"
          badgeType="success"
          icon={CheckCircle2}
          colorScheme="emerald"
        />
      </div>

      {/* LISTADO DE ACTIVIDADES Y CUPOS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header y Filtros */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Control de Inscriptos por Actividad vs. Cupo Máximo Permitido
            </h2>
            <p className="text-xs text-slate-500">
              Gestión de cupos deportivos, horarios de entrenamiento y verificación de apto médico vigente.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar disciplina, profesor o lugar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <select
              value={filterCupo}
              onChange={(e) => setFilterCupo(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Todas las Disciplinas ({actividades.lista.length})</option>
              <option value="CRITICO">Cupo Alto / Alerta (&gt;70%)</option>
              <option value="DISPONIBLE">Cupo Amplio (&lt;70%)</option>
            </select>
          </div>
        </div>

        {/* Acordeón de Disciplinas */}
        <div className="divide-y divide-slate-200">
          {filteredActividades.map((act) => {
            const isExpanded = expandedActivityId === act.id;
            const porcentaje = Math.round((act.inscriptosCount / act.cupoMaximo) * 100);

            return (
              <div key={act.id} className="transition-colors">
                {/* Cabecera de la Actividad */}
                <div 
                  onClick={() => toggleExpand(act.id)}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{act.nombre}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        act.estadoCupo === 'CRITICO'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : act.estadoCupo === 'ADVERTENCIA'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {act.estadoCupo === 'CRITICO' ? 'Cupo Crítico' : act.estadoCupo === 'ADVERTENCIA' ? 'Cupo Alto' : 'Vacantes Libres'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {act.profesor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {act.diasHorarios}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {act.lugar}
                      </span>
                    </div>
                  </div>

                  {/* Indicador de Cupo y Barra */}
                  <div className="flex items-center gap-4 lg:w-80 shrink-0">
                    <div className="w-full space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">
                          {act.inscriptosCount} / {act.cupoMaximo} inscriptos
                        </span>
                        <span className={`${
                          act.estadoCupo === 'CRITICO' ? 'text-rose-600' : 'text-slate-600'
                        }`}>
                          {porcentaje}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            act.estadoCupo === 'CRITICO' 
                              ? 'bg-rose-500' 
                              : act.estadoCupo === 'ADVERTENCIA' 
                              ? 'bg-amber-500' 
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, porcentaje)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-right text-slate-400">
                        {act.cupoDisponible} lugares restantes
                      </div>
                    </div>

                    <div className="text-slate-400 p-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Detalle Desplegable con Lista de Inscriptos (Minimización Ley 25.326) */}
                {isExpanded && (
                  <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Nómina de Deportistas Inscriptos ({act.inscriptos.length})
                      </h4>
                      <span className="text-[11px] text-slate-400 italic">
                        Sin datos contables de cuotas (Ley 25.326)
                      </span>
                    </div>

                    {act.inscriptos.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2">
                        No hay socios registrados en esta actividad actualmente.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {act.inscriptos.map((socio) => (
                          <div 
                            key={socio.id}
                            className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900 truncate">
                                {socio.nombre}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-100 text-slate-700">
                                {socio.categoria}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-500 flex justify-between">
                              <span>Legajo: {socio.id}</span>
                              <span>DNI: {socio.dni}</span>
                            </div>

                            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">Apto Médico:</span>
                              {socio.aptoMedicoVigente ? (
                                <span className="text-emerald-700 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Vigente
                                </span>
                              ) : (
                                <span className="text-amber-700 font-bold flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> Vencido
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
