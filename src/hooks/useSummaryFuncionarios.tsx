import { QueryGetFuncionarios } from '../graphql/Funcionario/Query';

export interface SummaryFuncionario {
  id: number;
  nome: string;
  totalPedidos: number;
  totalRealizados: number;
  taxaAproveitamento: number;
  mediaTempoPorPedido: string; // Formato "mm:ss"
  mediaHorasTrabalhadas: string; // Formato "hh:mm"
  mediaPedidosRealizados: number; // Média de pedidos realizados
}

const useSummaryFuncionario = (
  startDate?: Date,
  endDate?: Date,
  type: string = "month"
): SummaryFuncionario[] => {
  if (!startDate && !endDate) {
    const now = new Date();

    switch (type) {
      case "day":
        // Define para o dia anterior
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 1);
        endDate = new Date(startDate);
        break;

      case "week":
        // Define para a semana anterior
        endDate = new Date(now);
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        break;

      case "month":
      default:
        // Define para o mês atual
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
    }
  }

  const { data } = QueryGetFuncionarios();

  const funcionarios = data?.GetFuncionariosEstoque || [];

  const summaryFuncionarios: SummaryFuncionario[] = funcionarios.map((funcionario) => {
    const diasTrabalhados = (funcionario.dia_trabalhado_estoque || []).filter((dia) => {
      const diaData = new Date(dia.data_trabalho);
      return startDate && endDate ? diaData >= startDate && diaData <= endDate : true;
    });

    const id = funcionario.id;
    const nome = funcionario.nome || '';

    // Calcula o total de pedidos e realizados considerando apenas os dias filtrados
    const totalPedidos = diasTrabalhados.reduce((acc: number, dia) => acc + dia.pedidos, 0);
    const totalRealizados = diasTrabalhados.reduce((acc: number, dia) => acc + dia.realizados, 0);

    // Calcular o tempo total trabalhado em minutos, descontando 1 hora de almoço
    let tempoTotalTrabalhado = diasTrabalhados.reduce((acc, dia) => {
      if (!dia.horario_entrada || !dia.horario_saida) return acc;

      const [horasEntrada, minutosEntrada] = dia.horario_entrada.split(':').map(Number);
      const [horasSaida, minutosSaida] = dia.horario_saida.split(':').map(Number);

      const entrada = new Date(1970, 0, 1, horasEntrada, minutosEntrada);
      const saida = new Date(1970, 0, 1, horasSaida, minutosSaida);

      // Calculando o tempo trabalhado em minutos para cada dia
      let minutosTrabalhados = (saida.getTime() - entrada.getTime()) / 1000 / 60;

      // Descontar 1 hora de almoço (60 minutos)
      minutosTrabalhados -= 60;

      return acc + minutosTrabalhados;
    }, 0);

    // Calcular a média de tempo por pedido realizado em minutos e segundos
    const mediaTempoPorPedido = totalRealizados > 0 
      ? (tempoTotalTrabalhado / totalRealizados) : 0; // Média em minutos
    
    // Separar minutos e segundos para uma média precisa
    const minutos = Math.floor(mediaTempoPorPedido);
    const segundos = Math.round((mediaTempoPorPedido - minutos) * 60);
    const mediaTempoFormatada = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

    // Calcular a média de horas trabalhadas (em horas e minutos)
    const mediaHorasTrabalhadas = diasTrabalhados.length > 0
      ? (tempoTotalTrabalhado / 60) / diasTrabalhados.length // Média em horas
      : 0;

    const horasTrabalhadas = Math.floor(mediaHorasTrabalhadas);
    const minutosTrabalhados = Math.round((mediaHorasTrabalhadas - horasTrabalhadas) * 60);
    const mediaHorasFormatada = `${String(horasTrabalhadas).padStart(2, '0')}:${String(minutosTrabalhados).padStart(2, '0')}`;

    // Calcular a média de pedidos realizados
    const mediaPedidosRealizados = diasTrabalhados.length > 0
      ? totalRealizados / diasTrabalhados.length
      : 0;

    const taxaAproveitamento = totalPedidos > 0 
      ? (totalRealizados / totalPedidos) * 100
      : 0;

    return {
      id,
      nome,
      totalPedidos,
      totalRealizados,
      taxaAproveitamento,
      mediaTempoPorPedido: mediaTempoFormatada,
      mediaHorasTrabalhadas: mediaHorasFormatada,
      mediaPedidosRealizados: parseFloat(mediaPedidosRealizados.toFixed(2)), // Limitar a duas casas decimais
    };
  });

  return summaryFuncionarios;
};

export default useSummaryFuncionario;
