export interface TypesGetDiasTrabalho {
  GetDiasTrabalhadosEstoque: {
    id: number;
    pedidos: number;
    realizados: number;
    horario_entrada: string;
    horario_saida: string;
    data_trabalho: Date;
    usuarioId: number;
  }[]
}

export interface TypesGetAllDiasTrabalho {
  GetAllDiasTrabalhadosEstoque: {
  id: number;
  pedidos: number;
  realizados: number;
  horario_entrada: string;
  horario_saida: string;
  data_trabalho: Date;
  usuarioId: number;
} []
}

export interface TypesGetDiaTrabalhoByID {
  GetDiaTrabalhadoEstoqueByID:{
    id: number;
    pedidos: number;
    realizados: number;
    horario_entrada: string;
    horario_saida: string;
    data_trabalho: Date;
    usuarioId: number;
  }
}

export interface TypesSetDiaTrabalho {
  SetDiaTrabalhadoEstoque: {
    id: number;
    usuarioId: number;
  }
}

export interface TypesPutDiaTrabalho {
  PutDiaTrabalhadoEstoque: {
    id: number;
  }
}

export interface TypesDeleteDiaTrabalho {
  DeleteDiaTrabalhadoEstoque: {
    id: number;
  }
}

