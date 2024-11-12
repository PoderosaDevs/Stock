import { useMutation } from "@apollo/client";
import { TypesSetDiaTrabalho } from "./Types";
import { SET_DIA_TRABALHO_SCHEMA } from "./Schema";

export function MutationSetDiaTrabalho() {
  const [body, { data, error, loading }] = useMutation<TypesSetDiaTrabalho>(SET_DIA_TRABALHO_SCHEMA, {
    fetchPolicy: "network-only",
  });

  async function FormSet(data: any) {
    try {
      return await body({
        variables: {
          data: { ...data },
        },
      });

    } catch (e) {
      console.error('Erro na requisição:'+ e);
      return e
    }
  }

  return { FormSet, data, error, loading };
}