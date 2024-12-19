import { gql } from "@apollo/client";

export const GET_DIAS_TRABALHO_SCHEMA = gql`
query GetDiasTrabalhadosEstoque($endDate: Date, $startDate: Date, $usuarioId: Float) {
  GetDiasTrabalhadosEstoque(endDate: $endDate, startDate: $startDate, usuarioId: $usuarioId) {
    id
    pedidos
    realizados
    horario_entrada
    horario_saida
    data_trabalho
    usuarioId
  }
}
`

export const GET_ALL_DIAS_TRABALHO_SCHEMA = gql`
query GetAllDiasTrabalhadosEstoque($endDate: Date, $startDate: Date, $singleDate: Date) {
  GetAllDiasTrabalhadosEstoque(endDate: $endDate, startDate: $startDate, singleDate: $singleDate) {
    id
    pedidos
    realizados
    horario_entrada
    horario_saida
    data_trabalho
    usuarioId

  }
}
`

export const GET_DIA_TRABALHO_BY_ID = gql`
query GetDiaTrabalhadoEstoqueByID($getDiaTrabalhadoEstoqueByIdId: Float!) {
  GetDiaTrabalhadoEstoqueByID(id: $getDiaTrabalhadoEstoqueByIdId) {
    id
    pedidos
    realizados
    horario_entrada
    horario_saida
    data_trabalho
    usuarioId
  }
}
`

export const SET_DIA_TRABALHO_SCHEMA = gql`
mutation SetDiaTrabalhadoEstoque($data: DiaTrabalhadoEstoqueInput!) {
  SetDiaTrabalhadoEstoque(data: $data) {
    id
    usuarioId
  }
}
`

export const PUT_DIA_TRABALHO_SCHEMA = gql`
mutation PutDiaTrabalhadoEstoque($data: DiaTrabalhadoEstoqueInputUpdate!) {
  PutDiaTrabalhadoEstoque(data: $data) {
    id
  }
}
`

export const DELETE_DIA_TRABALHO_SCHEMA = gql`
mutation DeleteDiaTrabalhadoEstoque($deleteDiaTrabalhadoEstoqueId: Float!) {
  DeleteDiaTrabalhadoEstoque(id: $deleteDiaTrabalhadoEstoqueId) {
    id
  }
}
`