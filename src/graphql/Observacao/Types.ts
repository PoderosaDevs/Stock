export interface TypesGetOcorrencias {
  GetObservacoes:{
  result: {
    id: number;
    title: string;
    description: string;
    data: Date;
    usuarioId: number;
  }[]
  pageInfo: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }}
}

export interface TypesGetOcorrenciaByID {
  GetObservacaoByID: {
    id: number;
    title: string;
    description: string;
    data: Date;
    usuario_id: number;
  }
}

export interface TypesSetOcorrencia {
  SetObservacao: {
    id: number;
  }
}

export interface TypesPutOcorrencia {
  PutObservacao: {
    id: number
  }
}

export interface TypesDeleteOcorrencia {
  DeleteObservacao: {
    id: number;
  }
}
