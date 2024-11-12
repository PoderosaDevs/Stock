export interface GetFuncionarioTypes {
  GetFuncionariosEstoque: {
    id: number;
    nome: string;
    dia_trabalhado_estoque: {
      id: number;
      pedidos: number;
      realizados: number;
      horario_entrada: string;
      horario_saida: string;
      data_trabalho: Date;
      usuarioId: number;
    }[]
  }[]
}