import { QueryAllGetDiasTrabalho } from '../graphql/DiaTrabalhado/Query';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, subWeeks, subDays, formatISO } from 'date-fns';

interface Summary {
  totalPedidos: number;
  totalRealizados: number;
  mediaTempoPorPedido: string; // Formato "mm:ss"
  mediaHorasTrabalhadas: string; // Formato "hh:mm"
  mediaPedidosRealizados: number; 
}

const useSummary = (type: string): Summary => {
  console.log(type);
  
  let startDate: Date;
  let endDate: Date;

  switch (type) {
    case 'month':
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
      break;
    case 'week':
      startDate = startOfWeek(subWeeks(new Date(), 1));
      endDate = endOfWeek(subWeeks(new Date(), 1));
      break;
    case 'day':
      startDate = subDays(new Date(), 1);
      endDate = startDate;
      break;
    default:
      return { totalPedidos: 0, totalRealizados: 0, mediaTempoPorPedido: "00:00", mediaHorasTrabalhadas: "00:00", mediaPedidosRealizados: 0 };
  }

  const { data } = QueryAllGetDiasTrabalho({
    variables: {
      startDate: formatISO(startDate),
      endDate: formatISO(endDate),
    },
  });

  const diasTrabalhados = data?.GetAllDiasTrabalhadosEstoque || [];

  let totalPedidos = 0;
  let totalRealizados = 0;
  let tempoTotalTrabalhado = 0;
  
  if (diasTrabalhados.length > 0) {
    totalPedidos = diasTrabalhados.reduce((acc, dia) => acc + dia.pedidos, 0) / 2;
    totalRealizados = diasTrabalhados.reduce((acc, dia) => acc + dia.realizados, 0) / 2;

    tempoTotalTrabalhado = diasTrabalhados.reduce((acc, dia) => {
      if (!dia.horario_entrada || !dia.horario_saida) return acc;

      const [horasEntrada, minutosEntrada] = dia.horario_entrada.split(':').map(Number);
      const [horasSaida, minutosSaida] = dia.horario_saida.split(':').map(Number);

      const entrada = new Date(1970, 0, 1, horasEntrada, minutosEntrada);
      const saida = new Date(1970, 0, 1, horasSaida, minutosSaida);

      let minutosTrabalhados = (saida.getTime() - entrada.getTime()) / 1000 / 60;

      minutosTrabalhados -= 60;
      return acc + minutosTrabalhados;
    }, 0);
  }
  
  const mediaTempoPorPedido = totalRealizados > 0 
    ? (tempoTotalTrabalhado / totalRealizados) : 0;

  const minutos = Math.floor(mediaTempoPorPedido);
  const segundos = Math.round((mediaTempoPorPedido - minutos) * 60);
  const mediaTempoFormatada = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

  const mediaHorasTrabalhadas = totalRealizados > 0
    ? (tempoTotalTrabalhado / 60) / diasTrabalhados.length 
    : 0;

  const horasTrabalhadas = Math.floor(mediaHorasTrabalhadas);
  const minutosTrabalhados = Math.round((mediaHorasTrabalhadas - horasTrabalhadas) * 60);
  const mediaHorasFormatada = `${String(horasTrabalhadas).padStart(2, '0')}:${String(minutosTrabalhados).padStart(2, '0')}`;

  const mediaPedidosRealizados = diasTrabalhados.length > 0 
    ? totalRealizados / diasTrabalhados.length 
    : 0;

  return {
    totalPedidos,
    totalRealizados,
    mediaTempoPorPedido: mediaTempoFormatada,
    mediaHorasTrabalhadas: mediaHorasFormatada,
    mediaPedidosRealizados,
  };
};

export default useSummary;
