import { useEffect, useState } from "react";
import useSummaryFuncionario from "../../hooks/useSummaryFuncionarios";

export function Overview() {
  const funcionarios = useSummaryFuncionario();
  const [currentFuncionarioIndex, setCurrentFuncionarioIndex] = useState(0);

  // Dados fictícios dos últimos 15 dias para exemplo
  const pedidosUltimos15Dias = [100, 120, 90, 110, 150, 80, 130, 140, 70, 160, 200, 180, 120, 140, 110];

  // Gera as datas dos últimos 15 dias
  const getUltimos15Dias = () => {
    const hoje = new Date();
    return Array.from({ length: 15 }, (_, i) => {
      const dia = new Date(hoje);
      dia.setDate(hoje.getDate() - (14 - i));
      return dia.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    });
  };

  const ultimos15Dias = getUltimos15Dias();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFuncionarioIndex((prevIndex) => (prevIndex + 1) % funcionarios.length);
    }, 5000); // Alterna a cada 5 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, [funcionarios.length]); // Adicionando a length como dependência

  const currentFuncionario = funcionarios[currentFuncionarioIndex];

  if (!currentFuncionario) return <p>Carregando dados...</p>;

  const totalPedidos = currentFuncionario.totalPedidos;
  const totalRealizados = currentFuncionario.totalRealizados;
  const progressValue = (totalRealizados / totalPedidos) * 100;

  return (
    <div className="bg-gray-900 h-screen flex justify-center items-center p-6">
      <div className="w-11/12 max-w-7xl bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-white text-4xl font-bold text-center mb-2">Indicador de Performance</h1>
        <h2 className="text-white text-3xl text-center mb-4">Funcionário: {currentFuncionario.nome}</h2>

        <div className="flex w-full justify-around space-x-4 mb-10">
          {/* Card Pedidos */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-start w-1/3">
            <h3 className="text-4xl font-semibold text-rose-600 mb-4">Pedidos:</h3>
            <div className="flex w-full flex-col gap-2 text-xl">
              <div className="flex justify-between">
                <p>Total Pedidos:</p>
                <p className="font-semibold text-2xl">{totalPedidos}</p>
              </div>
              <div className="flex justify-between">
                <p>Total Realizados:</p>
                <p className="font-semibold text-2xl">{totalRealizados}</p>
              </div>
              <div className="flex justify-between">
                <p>Taxa de Aproveitamento:</p>
                <p className="font-semibold text-2xl">{currentFuncionario.taxaAproveitamento.toFixed(2)}%</p>
              </div>
            </div>
          </div>

          {/* Card Média Tempo */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-start w-1/3">
            <h3 className="text-3xl font-semibold text-rose-600 mb-4">Média Tempo:</h3>
            <div className="flex w-full flex-col gap-2 text-xl">
              <div className="flex justify-between">
                <p>Ideal:</p>
                <p className="font-semibold text-2xl">01:00m</p>
              </div>
              <div className="flex justify-between">
                <p>Médio:</p>
                <p className="font-semibold text-2xl">{currentFuncionario.mediaTempoPorPedido}m</p>
              </div>
              <div className="flex justify-between">
                <p>Média de Produção:</p>
                <p className="font-semibold text-2xl">{currentFuncionario.mediaHorasTrabalhadas}h</p>
              </div>
            </div>
          </div>

          {/* Card Realização */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-start w-1/3">
            <h3 className="text-3xl font-semibold text-rose-600 mb-4">Realização:</h3>
            <div className="flex w-full flex-col gap-2 text-xl">
              <div className="flex justify-between">
                <p>Média p/ dia:</p>
                <p className="font-semibold text-2xl">{currentFuncionario.mediaPedidosRealizados}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white pb-6 mb-6 w-full flex flex-col justify-center items-center rounded">
          <h2 className="py-4 text-3xl font-semibold">Pedidos Mensal</h2>
          <div className="relative bg-[#f2f2f2] rounded-lg w-11/12">
            <div
              className="bg-rose-600 rounded-lg"
              style={{ width: `${progressValue}%`, height: '20px' }}
            ></div>
          </div>
          {/* Indicadores de porcentagem */}
          <div className="flex justify-between w-11/12 mt-1">
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i} className="text-xs">{i * 10}%</span>
            ))}
          </div>
        </div>

        {/* Gráfico de Barras - Últimos 15 dias */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="py-4 text-3xl font-semibold text-center">Últimos Pedidos 15 Dias</h2>
          <div className="flex border-2 bg-[#f5f5f5] justify-around items-end h-48 relative">
            {pedidosUltimos15Dias.map((value, index) => (
              <div key={index} className="flex flex-col items-center group relative">
                <div
                  className="bg-rose-500 w-6 rounded-t group-hover:bg-rose-700 transition-all duration-200"
                  style={{ height: `${value * 0.8}px` }} // Ajuste da altura para cada valor
                ></div>
                <span className="text-sm mt-2 border-t-2 border-rose-600 font-semibold">{ultimos15Dias[index]}</span>

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center">
                  <span className="bg-gray-700 text-white text-xs rounded px-2 py-1">
                    Pedidos: {value}
                  </span>
                  <span className="bg-gray-700 h-2 w-2 rotate-45 mt-[-4px]"></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
