import { gql } from "@apollo/client";

export const GET_FUNCIONARIOS_ESTOQUE_SCHEMA = gql`
query GetFuncionariosEstoque {
  GetFuncionariosEstoque {
    id
    nome
    dia_trabalhado_estoque {
      id
      pedidos
      realizados
      horario_entrada
      horario_saida
      data_trabalho
      usuarioId
    }
    Observacao {
      id
      title
      description
      data
      usuario_id
    }
  }
}
`

export const GET_FUNCIONARIO_ESTOQUE_BY_ID_SCHEMA = gql`
query GetFuncionarioEstoqueByID($usuarioId: Float!) {
  GetFuncionarioEstoqueByID(usuarioId: $usuarioId) {
    id
    nome
    dia_trabalhado_estoque {
      id
      pedidos
      realizados
      data_trabalho
      horario_entrada
      horario_saida
    }
  }
}
`