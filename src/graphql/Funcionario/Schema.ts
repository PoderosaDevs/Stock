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
  }
}
`