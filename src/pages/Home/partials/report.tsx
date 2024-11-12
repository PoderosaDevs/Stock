import { useState } from 'react';
import { ReportContent } from './ReportContent'; 
import useSummary from '../../../hooks/useSummary';

export function Report() {
  const [activeTab, setActiveTab] = useState('diaria');
  
  // Chamada ao hook com base no tipo ativo
  const summaryType = activeTab === 'diaria' ? 'day' : activeTab === 'semanal' ? 'week' : 'month';
  const { totalPedidos, totalRealizados } = useSummary(summaryType);

  return (
    <div className="bg-white px-4 py-2">
      <section></section>
      <div></div>

      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded-full ${activeTab === 'diaria' ? 'bg-[#d40f7d] text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('diaria')}
        >
          Diária
        </button>
        <button
          className={`px-4 py-2 rounded-full ${activeTab === 'semanal' ? 'bg-[#d40f7d] text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('semanal')}
        >
          Semanal
        </button>
        <button
          className={`px-4 py-2 rounded-full ${activeTab === 'mensal' ? 'bg-[#d40f7d] text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('mensal')}
        >
          Mensal
        </button>
      </div>

      {/* Renderiza o conteúdo da tab ativa */}
      <div className="mt-4">
        {activeTab === 'diaria' && <ReportContent title="Diária" pedidos={String(totalPedidos)} realizados={String(totalRealizados)} type="day" />}
        {activeTab === 'semanal' && <ReportContent title="Semanal" pedidos={String(totalPedidos)} realizados={String(totalRealizados)} type="week" />}
        {activeTab === 'mensal' && <ReportContent title="Mensal" pedidos={String(totalPedidos)} realizados={String(totalRealizados)} type="month" />}
      </div>
    </div>
  );
}
