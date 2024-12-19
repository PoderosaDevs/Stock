import { Link } from "react-router-dom";
import useSummaryFuncionario from "../../hooks/useSummaryFuncionario";
import { QueryGetOcorrencias } from "../../graphql/Observacao/Query";

export function OverviewEmployee() {
  const { id, mediaHorasTrabalhadas, mediaPedidosRealizados, mediaTempoPorPedido, nome, taxaAproveitamento, totalPedidos, totalRealizados } = useSummaryFuncionario(); // Ajuste para obter os dados corretos do hook
  const { data: DataOcorrencias } = QueryGetOcorrencias({
    variables: {
      userId: parseInt(String(id)),
    },
  })
  const progressValue = (totalRealizados / totalPedidos) * 100;

  return (
    <div className="bg-gray-900 h-screen flex justify-center items-center p-6">

      <div className="w-11/12 max-w-7xl bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="relative">
          <Link className="bg-rose-700 px-3 py-2 rounded-md text-white" to={'/'}>
            Voltar
          </Link>
          <h1 className="text-white text-4xl font-bold text-center mb-2">Indicador de Performance</h1>
          <h2 className="text-white text-3xl text-center mb-4">Funcionário: {nome}</h2>

        </div>
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
                <p className="font-semibold text-2xl">{taxaAproveitamento.toFixed(2)}%</p>
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
                <p className="font-semibold text-2xl">{mediaTempoPorPedido}m</p>
              </div>
              <div className="flex justify-between">
                <p>Média de Produção:</p>
                <p className="font-semibold text-2xl">{mediaHorasTrabalhadas}h</p>
              </div>
            </div>
          </div>

          {/* Card Realização */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-start w-1/3">
            <h3 className="text-3xl font-semibold text-rose-600 mb-4">Realização:</h3>
            <div className="flex w-full flex-col gap-2 text-xl">
              <div className="flex justify-between">
                <p>Média p/ dia:</p>
                <p className="font-semibold text-2xl">{mediaPedidosRealizados}</p>
              </div>
            </div>
            <h3 className="text-3xl font-semibold text-rose-600 mb-4">Ocorrências:</h3>
            <div className="flex w-full flex-col gap-2 text-xl">
              <div className="flex justify-between">
                <p>ocorrência p/ mês:</p>
                <p className="font-semibold text-2xl">{DataOcorrencias?.GetObservacoes.pageInfo.totalItems}</p>
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
      </div>
    </div>
  );
}
