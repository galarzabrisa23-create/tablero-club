# 📊 "Un Tablero para el Club" — Sistema Analítico Integral

> **Proyecto Académico:** Tecnicatura Superior en Ciencia de Datos e Inteligencia Artificial  
> **Institución:** Instituto Tecnológico Universitario de Moreno (ITUNM)  
> **Equipo:** Grupo F  
> **Período de Análisis:** Noviembre 2026  

---

## 🎯 1. Objetivo General del Tablero
El objetivo primordial es unificar en una sola pantalla interactiva y centralizada los datos de **socios, cuotas y actividades deportivas**, permitiendo a la **Comisión Directiva y a la Tesorería** visualizar de forma inmediata quién tiene cuotas atrasadas, su antigüedad y el estado financiero global sin necesidad de solicitar informes manuales ni depender de planillas dispersas.

---

## 📈 2. Indicadores Clave de Desempeño (KPIs Obligatorios)

| KPI | Descripción y Cálculo | Valor en Noviembre 2026 |
| :--- | :--- | :--- |
| **1. Padrón Activo & Flujo** | Total de socios activos con cuota habilitada, comparado contra altas y bajas del mes. | **18 Activos** (+4 altas, -2 bajas, **+2 Neto**) |
| **2. Cobranza del Mes** | Porcentaje y monto recaudado a la fecha sobre la facturación teórica del mes. | **$132.500** cobrados (**68%** de $195.000) • Falta: **$62.500** |
| **3. Deuda Acumulada & Antigüedad** | Cartera total adeudada por socios en mora y antigüedad individual (meses impagos). | **$172.500** total adeudado • **6 socios en mora** (Máx: **5 meses**) |
| **4. Ocupación de Actividades** | Inscriptos por disciplina deportiva vs. cupo máximo permitido. | **18 inscriptos / 176 cupos totales (10% global)** • Disciplinas con cupo alto bajo control |
| **5. Resumen Ejecutivo (1-Screen)** | Semáforo consolidado de salud institucional y alerta de desvíos para reunión mensual. | **Nivel Operativo Óptimo con Gestión Focalizada de Mora** |

---

## 🧭 3. Vistas y Roles de Navegación (Método MoSCoW)

El tablero cuenta con 4 vistas principales modeladas según las historias de usuario del proyecto:

1. **🏛️ Vista Presidencia / Comisión Directiva (Must Have):**
   - Resumen ejecutivo global en **una sola pantalla** concebido específicamente para la reunión mensual de Comisión Directiva.
   - Panel de salud financiera, desglose de morosidad, alertas y **botón directo para exportar/imprimir en PDF** el anexo al Acta N° 11/2026.
2. **💰 Vista Tesorería (Must Have):**
   - Listado de socios **ordenados estrictamente por antigüedad de la deuda** (quién debe hace más tiempo arriba de todo).
   - Detalle de meses impagos, períodos exactos adeudados (ej. `2026-07`, `2026-08`), montos totales, fechas de último pago y comprobantes correlativos de recibos contables.
   - Filtros por tramo de mora (Mora Crítica ≥3 meses, Mora Media 2 meses, Mora Leve 1 mes, Al Día) y buscador instantáneo.
3. **📋 Vista Secretaría (Should Have):**
   - Padrón oficial de socios con datos de contacto, categoría estatutaria y antigüedad.
   - Pestaña especializada en **Movimientos del Mes**: altas del mes y **bajas del mes con motivo formal asentado** (ej. mudanza, falta de tiempo).
   - Formulario interactivo para registrar nuevas altas con validación automática anti-duplicados.
4. **⚽ Vista Coordinación Deportiva (Should Have):**
   - Control de ocupación y cupos por actividad (Fútbol, Natación, Básquet, Tenis, Gimnasio, Patín, Vóley).
   - Monitoreo de vacantes restantes y apto médico deportivo vigente.
   - **Cumplimiento estricto de la Ley 25.326:** se ocultan las cuentas corrientes, cuotas y deudas a este rol (principio de minimización de datos personales).

---

## 🛡️ 4. Reglas de Negocio, Calidad y Validaciones

- **Consistencia y Cuadratura Contable:**
  El sistema valida matemáticamente que:
  $$\text{Total Facturado Mes (\$195.000)} = \text{Total Cobrado (\$132.500)} + \text{Saldo Pendiente (\$62.500)}$$
  Discrepancia contable: **$0 (Cuadratura Exacta)**.
- **Cruzamiento Lógico de Planillas (Secretaría ↔ Tesorería):**
  Se verifica que ningún socio dado de baja en Secretaría devengue cuotas indebidas en Tesorería ni genere deudas ficticias.
- **Auditoría de Duplicados e Integridad:**
  Verificación algorítmica de DNIs y Números de Socio únicos, y comprobación de ausencia de fechas vacías en altas o bajas.
- **Rendimiento:**
  Arquitectura con cálculo en memoria ultra-optimizado con tiempos de respuesta menores a 50 milisegundos (< 3 segundos requerido).
- **Protección de Datos Personales (Ley 25.326):**
  Control de acceso basado en roles (RBAC) que enmascara información sensible según las incumbencias de cada área del club.

---

## 🚀 5. Instalación y Ejecución Local

### Prerrequisitos:
- Node.js versión 18+ (probado exitosamente en v24)
- npm versión 9+

### Pasos:
```bash
# 1. Ingresar a la carpeta del proyecto
cd C:\Users\galar\.gemini\antigravity\scratch\tablero-club

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Compilar para producción (Build)
npm run build

# 5. Previsualizar la versión de producción
npm run preview
```

Una vez ejecutado `npm run dev`, abre tu navegador en `http://localhost:5173/` para interactuar con el tablero completo.
