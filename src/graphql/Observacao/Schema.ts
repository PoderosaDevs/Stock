import { gql } from "@apollo/client";

export const GET_OCORRENCIAS_SCHEMA = gql`
query GetObservacoes($userId: Float!, $pagination: Pagination) {
  GetObservacoes(userId: $userId, pagination: $pagination) {
    result {
      id
      title
      description
      data
      usuario_id
    }
    pageInfo {
      currentPage
      totalPages
      totalItems
      hasNextPage
      hasPreviousPage
    }
  }
}
`

export const GET_OCORRENCIA_BY_ID_SCHEMA = gql`
query GetObservacaoByID($getObservacaoByIdId: Float!) {
  GetObservacaoByID(id: $getObservacaoByIdId) {
    id
    title
    description
    data
    usuario_id
  }
}
`

export const SET_OCORRENCIA_SCHEMA = gql`
mutation SetObservacao($data: ObservacaoInput!) {
  SetObservacao(data: $data) {
    id
  }
}
`

export const PUT_OCORRENCIA_SCHEMA = gql`
mutation PutObservacao($data: ObservacaoUpdateInput!) {
  PutObservacao(data: $data) {
    id
  }
}
`

export const DELETE_OCORRENCIA_SCHEMA = gql`
mutation DeleteObservacao($observacaoId: Float!) {
  DeleteObservacao(observacaoId: $observacaoId) {
    id
  }
}
`