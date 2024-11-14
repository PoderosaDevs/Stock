import { useParams } from "react-router-dom"; // Importando o useParams
import { QueryGetFuncionarioByID } from "../graphql/Funcionario/Query";
import { SummaryFuncionario } from "./useSummaryFuncionarios";

interface Params {
  id: string;
  [key: string]: string | undefined;
}

const useSummaryFuncionario = (
  startDate?: Date,
  endDate?: Date,
  type: string = "month"
): SummaryFuncionario  => { // Agora retorna um array de SummaryFuncionario

  // Define as datas caso não sejam passadas
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

  const { id } = useParams<Params>();
  const usuarioId = id ? parseInt(id) : null;
  const { data } = QueryGetFuncionarioByID({
    variables: {
      usuarioId: usuarioId // Passa o usuarioId convertido para número
    },
  });

  const funcionario = data?.GetFuncionarioEstoqueByID || null;

  if (!funcionario) {
    return {
      id: 0,
      nome: '',
      totalPedidos: 0,
      totalRealizados: 0,
      mediaTempoPorPedido: '0',
      mediaHorasTrabalhadas: '0',
      mediaPedidosRealizados: 0,
      taxaAproveitamento: 0,
    }
  }

  const diasTrabalhados = (funcionario.dia_trabalhado_estoque || []).filter((dia) => {
    const diaData = new Date(dia.data_trabalho);
    return startDate && endDate ? diaData >= startDate && diaData <= endDate : true;
  });

  const idFuncionario = funcionario.id;
  const nomeFuncionario = funcionario.nome || '';

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
    id: idFuncionario,
    nome: nomeFuncionario,
    totalPedidos,
    totalRealizados,
    taxaAproveitamento,
    mediaTempoPorPedido: mediaTempoFormatada,
    mediaHorasTrabalhadas: mediaHorasFormatada,
    mediaPedidosRealizados: parseFloat(mediaPedidosRealizados.toFixed(2)), // Limitar a duas casas decimais
  };
};

export default useSummaryFuncionario;
