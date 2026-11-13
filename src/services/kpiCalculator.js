// Servicio de Cálculo de Indicadores Clave de Desempeño (KPIs)
import { MOCK_MEMBERS, MOCK_ACTIVITIES, MOCK_PAYMENTS_RECORD, MEMBERSHIP_FEES } from '../data/mockData';

export function calculateClubKPIs() {
  const currentMonthPrefix = "2026-11";

  // 1. Padrón de Socios y Movimientos del Mes
  const totalSocios = MOCK_MEMBERS.length;
  const sociosActivos = MOCK_MEMBERS.filter(s => s.estado === 'ACTIVO');
  const sociosInactivos = MOCK_MEMBERS.filter(s => s.estado === 'INACTIVO');
  
  const altasMes = MOCK_MEMBERS.filter(s => s.fechaAlta && s.fechaAlta.startsWith(currentMonthPrefix));
  const bajasMes = MOCK_MEMBERS.filter(s => s.fechaBaja && s.fechaBaja.startsWith(currentMonthPrefix));
  const balanceNeto = altasMes.length - bajasMes.length;

  const desgloseCategorias = {
    ACTIVO: sociosActivos.filter(s => s.categoria === 'ACTIVO').length,
    CADETE: sociosActivos.filter(s => s.categoria === 'CADETE').length,
    INFANTIL: sociosActivos.filter(s => s.categoria === 'INFANTIL').length,
    VITALICIO: sociosActivos.filter(s => s.categoria === 'VITALICIO').length,
  };

  // 2. Estado de Cobranza del Mes (Noviembre 2026) y Deudas
  // Cruzamos socios activos con sus registros de pagos
  let totalFacturadoMes = 0;
  let totalCobradoMes = 0;
  let totalPendienteMes = 0;
  let deudaAcumuladaTotal = 0;

  const sociosConDeudaDetalle = sociosActivos.map(socio => {
    const feeMensual = MEMBERSHIP_FEES[socio.categoria] || 0;
    const pagoRecord = MOCK_PAYMENTS_RECORD.find(p => p.socioId === socio.id);

    const mesesDeuda = pagoRecord ? pagoRecord.mesesDeuda : 0;
    const cuotasAdeudadas = pagoRecord ? pagoRecord.cuotasAdeudadas : [];
    const deudaTotal = mesesDeuda * feeMensual;
    const estadoCobro = pagoRecord ? pagoRecord.estadoCobranzaMesActual : 'PENDIENTE';

    if (socio.categoria !== 'VITALICIO') {
      totalFacturadoMes += feeMensual;
      if (estadoCobro === 'PAGADO') {
        totalCobradoMes += feeMensual;
      } else {
        totalPendienteMes += feeMensual;
      }
    }

    deudaAcumuladaTotal += deudaTotal;

    // Clasificación de antigüedad
    let severidadMora = 'AL_DIA';
    if (mesesDeuda === 1) severidadMora = 'LEVE';
    else if (mesesDeuda === 2) severidadMora = 'MEDIA';
    else if (mesesDeuda >= 3) severidadMora = 'CRITICA';

    return {
      ...socio,
      feeMensual,
      mesesDeuda,
      cuotasAdeudadas,
      deudaTotal,
      estadoCobro,
      severidadMora,
      ultimoPagoFecha: pagoRecord ? pagoRecord.ultimoPagoFecha : 'Sin registros',
      ultimoPagoMonto: pagoRecord ? pagoRecord.ultimoPagoMonto : 0,
      comprobanteRecibo: pagoRecord ? pagoRecord.comprobanteRecibo : 'N/A',
      metodoPago: pagoRecord ? pagoRecord.metodoPago : 'N/A',
    };
  });

  // Ordenar Tesorería: Antigüedad de la deuda descendente (los que más meses deben primero)
  const rankingMorosos = [...sociosConDeudaDetalle]
    .filter(s => s.mesesDeuda > 0)
    .sort((a, b) => b.mesesDeuda - a.mesesDeuda || b.deudaTotal - a.deudaTotal);

  const porcentajeCobrabilidad = totalFacturadoMes > 0 
    ? Math.round((totalCobradoMes / totalFacturadoMes) * 100) 
    : 0;

  // Clasificación resumen por tramos de mora
  const morosidadPorTramos = {
    alDia: sociosConDeudaDetalle.filter(s => s.mesesDeuda === 0).length,
    moraLeve: sociosConDeudaDetalle.filter(s => s.mesesDeuda === 1).length,
    moraMedia: sociosConDeudaDetalle.filter(s => s.mesesDeuda === 2).length,
    moraCritica: sociosConDeudaDetalle.filter(s => s.mesesDeuda >= 3).length,
  };

  // 4. Inscriptos y Cupos por Actividad
  const actividadesConCupo = MOCK_ACTIVITIES.map(actividad => {
    const inscriptos = sociosActivos.filter(s => s.actividadId === actividad.id);
    const cupoDisponible = Math.max(0, actividad.cupoMaximo - inscriptos.length);
    const porcentajeOcupacion = Math.round((inscriptos.length / actividad.cupoMaximo) * 100);

    let estadoCupo = 'DISPONIBLE'; // verde
    if (porcentajeOcupacion >= 90) {
      estadoCupo = 'CRITICO'; // rojo
    } else if (porcentajeOcupacion >= 70) {
      estadoCupo = 'ADVERTENCIA'; // amarillo
    }

    return {
      ...actividad,
      inscriptosCount: inscriptos.length,
      inscriptos,
      cupoDisponible,
      porcentajeOcupacion,
      estadoCupo,
    };
  });

  const totalCapacidadDeportiva = MOCK_ACTIVITIES.reduce((acc, a) => acc + a.cupoMaximo, 0);
  const totalInscriptosDeportes = actividadesConCupo.reduce((acc, a) => acc + a.inscriptosCount, 0);
  const porcentajeOcupacionGlobal = Math.round((totalInscriptosDeportes / totalCapacidadDeportiva) * 100);

  return {
    periodo: "Noviembre 2026",
    padron: {
      total: totalSocios,
      activos: sociosActivos.length,
      inactivos: sociosInactivos.length,
      altasMes: altasMes.length,
      bajasMes: bajasMes.length,
      balanceNeto,
      desgloseCategorias,
      listaAltas: altasMes,
      listaBajas: bajasMes,
    },
    cobranza: {
      totalFacturadoMes,
      totalCobradoMes,
      totalPendienteMes,
      porcentajeCobrabilidad,
      deudaAcumuladaTotal,
      morosidadPorTramos,
      rankingMorosos,
      todosSociosCobranza: sociosConDeudaDetalle,
    },
    actividades: {
      lista: actividadesConCupo,
      totalCapacidad: totalCapacidadDeportiva,
      totalInscriptos: totalInscriptosDeportes,
      porcentajeOcupacionGlobal,
      actividadesEnAlerta: actividadesConCupo.filter(a => a.estadoCupo !== 'DISPONIBLE'),
    },
  };
}
