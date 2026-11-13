import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ExecutiveView from './components/views/ExecutiveView';
import TreasuryView from './components/views/TreasuryView';
import SecretaryView from './components/views/SecretaryView';
import CoordinationView from './components/views/CoordinationView';
import AuditModal from './components/AuditModal';
import PrintableReport from './components/PrintableReport';
import { calculateClubKPIs } from './services/kpiCalculator';
import { runDataConsistencyAudit, ROLE_PERMISSIONS } from './services/dataConsistency';

export default function App() {
  const [currentRole, setCurrentRole] = useState('PRESIDENCIA');
  const [activeTab, setActiveTab] = useState('presidencia');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditNonce, setAuditNonce] = useState(0);

  // KPIs calculados en memoria
  const kpiData = useMemo(() => {
    return calculateClubKPIs();
  }, [auditNonce]);

  // Auditoría de datos y reglas de negocio
  const auditData = useMemo(() => {
    return runDataConsistencyAudit();
  }, [auditNonce]);

  const handleReAudit = () => {
    setAuditNonce((prev) => prev + 1);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Encabezado Institucional y Navegación MoSCoW */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        auditData={auditData}
        onOpenAudit={() => setIsAuditModalOpen(true)}
        onPrint={handlePrint}
      />

      {/* Contenedor Principal de la Vista Activa */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 no-print">
        {activeTab === 'presidencia' && (
          <ExecutiveView 
            kpiData={kpiData} 
            onNavigateTab={(tab) => setActiveTab(tab)} 
            onPrint={handlePrint}
          />
        )}

        {activeTab === 'tesoreria' && (
          <TreasuryView 
            kpiData={kpiData} 
          />
        )}

        {activeTab === 'secretaria' && (
          <SecretaryView 
            kpiData={kpiData} 
          />
        )}

        {activeTab === 'coordinacion' && (
          <CoordinationView 
            kpiData={kpiData} 
          />
        )}
      </main>

      {/* Modal de Auditoría de Planillas y Consistencia de Datos */}
      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        auditData={auditData}
        onReAudit={handleReAudit}
      />

      {/* Reporte Estructurado Oculto para Impresión Directa / PDF */}
      <PrintableReport kpiData={kpiData} />

      {/* Footer de Créditos del Proyecto */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>Proyecto:</strong> "Un tablero para el club" • Grupo F
          </span>
          <span>
            Tecnicatura Superior en Ciencia de Datos e IA — Instituto Tecnológico Universitario de Moreno (ITUNM)
          </span>
          <span className="text-slate-400">
            Conforme a Ley 25.326 y Reglas Contables
          </span>
        </div>
      </footer>
    </div>
  );
}
