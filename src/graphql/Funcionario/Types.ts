export interface GetFuncionariosTypes {
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
    Observacao: {
      id: number;
      title: string;
      description: string;
      data: Date;
      usuario_id: number;
    }[]
  }[]
}

export interface GetFuncionarioByIDTypes {
  GetFuncionarioEstoqueByID: {
    id: number;
    nome: string;
    dia_trabalhado_estoque: {
      id: number;
      pedidos: number;
      realizados: number;
      data_trabalho: Date;
      horario_entrada: string;
      horario_saida: string;
    }[]
    Observacao: {
      id: number;
      title: string;
      description: string;
      data: Date;
      usuario_id: number;
    }[]
  }
}