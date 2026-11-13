import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  ShieldAlert, 
  ArrowUpRight, 
  ArrowDownRight,
  PlusCircle,
  FileCheck2
} from 'lucide-react';
import { MOCK_MEMBERS } from '../../data/mockData';
import KpiCard from '../KpiCard';

export default function SecretaryView({ kpiData }) {
  const { padron } = kpiData;
  const [subTab, setSubTab] = useState('PADRON'); // 'PADRON' | 'MOVIMIENTOS'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showNewMemberModal, setShowNewMemberModal] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    nombre: '',
    dni: '',
    categoria: 'ACTIVO',
    email: '',
    telefono: '',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Filtrado de socios para Secretaría
  const filteredMembers = MOCK_MEMBERS.filter((socio) => {
    const matchesSearch =
      socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio.dni.includes(searchTerm) ||
      socio.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter !== 'ALL' && socio.categoria !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && socio.estado !== statusFilter) return false;

    return true;
  });

  // Simulación de Alta de Socio con validaciones de negocio
  const handleCreateMember = (e) => {
    e.preventDefault();
    setFormError('');

    // Validación: campos vacíos
    if (!newMemberData.nombre.trim() || !newMemberData.dni.trim()) {
      setFormError('El Nombre y el DNI son campos obligatorios y no pueden estar vacíos.');
      return;
    }

    // Validación de negocio: Evitar duplicados de DNI
    const exists = MOCK_MEMBERS.some((s) => s.dni.replace(/\D/g, '') === newMemberData.dni.replace(/\D/g, ''));
    if (exists) {
      setFormError(`Regla de Consistencia: Ya existe un socio registrado con el DNI ${newMemberData.dni}.`);
      return;
    }

    setFormSuccess(`Socio ${newMemberData.nombre} dado de alta exitosamente con estado ACTIVO para Noviembre 2026.`);
    setTimeout(() => {
      setShowNewMemberModal(false);
      setFormSuccess('');
      setNewMemberData({ nombre: '', dni: '', categoria: 'ACTIVO', email: '', telefono: '' });
    }, 2000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* KPIs DE SECRETARÍA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Padrón Total Histórico"
          value={`${padron.total} Socios`}
          subtitle="Registrados en el sistema oficial"
          badgeText="Legajos únicos"
          badgeType="neutral"
          icon={Users}
          colorScheme="blue"
        />

        <KpiCard
          title="Socios Activos Habilitados"
          value={`${padron.activos} Socios`}
          subtitle={`${Math.round((padron.activos / padron.total) * 100)}% del padrón total`}
          badgeText="Con derechos estatutarios"
          badgeType="success"
          icon={CheckCircle2}
          colorScheme="emerald"
        />

        <KpiCard
          title="Altas de Noviembre 2026"
          value={`+${padron.altasMes} Nuevos`}
          subtitle="Nuevas incorporaciones del mes"
          badgeText="Ingresos registrados"
          badgeType="info"
          icon={UserPlus}
          colorScheme="purple"
        />

        <KpiCard
          title="Bajas de Noviembre 2026"
          value={`-${padron.bajasMes} Bajas`}
          subtitle={`Balance neto: ${padron.balanceNeto > 0 ? `+${padron.balanceNeto}` : padron.balanceNeto} socios`}
          badgeText="Con causa informada"
          badgeType="warning"
          icon={UserMinus}
          colorScheme="amber"
        />
      </div>

      {/* SUBNAVEGACIÓN DE SECRETARÍA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setSubTab('PADRON')}
            className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'PADRON'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Padrón General de Socios ({MOCK_MEMBERS.length})
          </button>

          <button
            onClick={() => setSubTab('MOVIMIENTOS')}
            className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'MOVIMIENTOS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Movimientos del Mes ({padron.altasMes} Altas / {padron.bajasMes} Bajas)
          </button>
        </div>

        <button
          onClick={() => setShowNewMemberModal(true)}
          className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Registrar Nueva Alta
        </button>
      </div>

      {/* CONTENIDO SEGÚN SUBTAB */}
      {subTab === 'PADRON' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Barra de Filtros */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Padrón Oficial de Socios del Club
              </h2>
              <p className="text-xs text-slate-500">
                Datos de contacto, categoría societaria y antigüedad institucional.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o DNI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Todas las Categorías</option>
                  <option value="ACTIVO">Activo</option>
                  <option value="CADETE">Cadete</option>
                  <option value="INFANTIL">Infantil</option>
                  <option value="VITALICIO">Vitalicio</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Todos los Estados</option>
                  <option value="ACTIVO">Solo Activos</option>
                  <option value="INACTIVO">Solo Bajas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabla Padrón */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <th className="py-3 px-4">N° Socio</th>
                  <th className="py-3 px-4">Nombre y Apellido</th>
                  <th className="py-3 px-3">DNI</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3">Fecha de Alta</th>
                  <th className="py-3 px-4">Contacto</th>
                  <th className="py-3 px-3">Apto Médico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredMembers.map((socio) => (
                  <tr key={socio.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {socio.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {socio.nombre}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {socio.dni}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                        {socio.categoria}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        socio.estado === 'ACTIVO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {socio.estado}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {socio.fechaAlta}
                    </td>
                    <td className="py-3 px-4 text-[11px]">
                      <div>{socio.email}</div>
                      <div className="text-slate-400">{socio.telefono}</div>
                    </td>
                    <td className="py-3 px-3">
                      {socio.aptoMedicoVigente ? (
                        <span className="text-emerald-700 font-semibold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Vigente
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold text-[10px] flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Pendiente
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* SOLAPA DE MOVIMIENTOS DEL MES (ALTAS Y BAJAS DETALLADAS) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Panel de Altas del Mes */}
          <div className="bg-white rounded-2xl border border-emerald-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Altas Registradas en Noviembre 2026 ({padron.altasMes})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nuevos socios incorporados con cuota devengada
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                +{padron.altasMes} Ingresos
              </span>
            </div>

            <div className="space-y-3">
              {padron.listaAltas.map((socio) => (
                <div key={socio.id} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">
                      {socio.nombre} <span className="font-normal text-slate-500">({socio.id})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      DNI: {socio.dni} • Categoría: <strong>{socio.categoria}</strong>
                    </div>
                    <div className="text-[10px] text-emerald-700 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Fecha de ingreso: {socio.fechaAlta}
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-white text-emerald-800 text-[11px] font-bold border border-emerald-200">
                    Activo
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Panel de Bajas del Mes con Motivo Declarado */}
          <div className="bg-white rounded-2xl border border-rose-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-100 rounded-lg text-rose-700">
                  <UserMinus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Bajas Registradas en Noviembre 2026 ({padron.bajasMes})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Socios desafectados con causa informada al acta
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                -{padron.bajasMes} Egresos
              </span>
            </div>

            <div className="space-y-3">
              {padron.listaBajas.map((socio) => (
                <div key={socio.id} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        {socio.nombre} <span className="font-normal text-slate-500">({socio.id})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        DNI: {socio.dni} • Alta original: {socio.fechaAlta}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                      Baja el {socio.fechaBaja}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-rose-100/80 text-[11px] text-rose-900 bg-white/70 p-2 rounded-lg border border-rose-200">
                    <span className="font-bold">Motivo de Baja: </span>
                    {socio.motivoBaja || "Sin motivo declarado"}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Regla de Consistencia Contable:</strong> Los socios de baja no acumulan deudas posteriores a su fecha de desvinculación.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Simulado de Registro de Nueva Alta con Reglas de Consistencia */}
      {showNewMemberModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                Registrar Nueva Alta de Socio
              </h3>
              <button 
                onClick={() => setShowNewMemberModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre y Apellido *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={newMemberData.nombre}
                  onChange={(e) => setNewMemberData({ ...newMemberData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">DNI (Sin puntos) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 38456123"
                  value={newMemberData.dni}
                  onChange={(e) => setNewMemberData({ ...newMemberData, dni: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10px] text-slate-400">Se valida automáticamente para evitar duplicados.</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Categoría</label>
                <select
                  value={newMemberData.categoria}
                  onChange={(e) => setNewMemberData({ ...newMemberData, categoria: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="ACTIVO">Activo ($15.000 / mes)</option>
                  <option value="CADETE">Cadete ($10.000 / mes)</option>
                  <option value="INFANTIL">Infantil ($7.500 / mes)</option>
                  <option value="VITALICIO">Vitalicio ($0)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewMemberModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs transition-colors"
                >
                  Guardar Alta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
