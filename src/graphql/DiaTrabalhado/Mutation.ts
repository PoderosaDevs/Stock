import { useMutation } from "@apollo/client";
import { TypesSetDiaTrabalho } from "./Types";
import { SET_DIA_TRABALHO_SCHEMA } from "./Schema";
import { GET_FUNCIONARIOS_ESTOQUE_SCHEMA } from "../Funcionario/Schema";

export function MutationSetDiaTrabalho() {
  const [body, { data, error, loading }] = useMutation<TypesSetDiaTrabalho>(SET_DIA_TRABALHO_SCHEMA, {
    fetchPolicy: "network-only",
    refetchQueries: [GET_FUNCIONARIOS_ESTOQUE_SCHEMA]
  });

  async function FormSet(data: any) {
    try {
      return await body({
        variables: {
          data: { ...data },
        },
        refetchQueries:[GET_FUNCIONARIOS_ESTOQUE_SCHEMA]
      });

    } catch (e) {
      console.error('Erro na requisição:'+ e);
      return e
    }
  }

  return { FormSet, data, error, loading };
}