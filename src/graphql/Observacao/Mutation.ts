import { useMutation } from "@apollo/client";
import { TypesDeleteOcorrencia, TypesPutOcorrencia, TypesSetOcorrencia } from "./Types";
import { DELETE_OCORRENCIA_SCHEMA, GET_OCORRENCIAS_SCHEMA, PUT_OCORRENCIA_SCHEMA, SET_OCORRENCIA_SCHEMA } from "./Schema";

export function MutationSetOcorrencia() {
  const [body, { data, error, loading }] = useMutation<TypesSetOcorrencia>(SET_OCORRENCIA_SCHEMA, {
    fetchPolicy: "network-only",
    refetchQueries: [GET_OCORRENCIAS_SCHEMA]
  });

  async function FormSet(data: any) {
    try {
      return await body({
        variables: {
          data: { ...data },
        },
        refetchQueries:[GET_OCORRENCIAS_SCHEMA]
      });

    } catch (e) {
      console.error('Erro na requisição:'+ e);
      return e
    }
  }

  return { FormSet, data, error, loading };
}

export function MutationPutOcorrencia() {
  const [body, { data, error, loading }] = useMutation<TypesPutOcorrencia>(PUT_OCORRENCIA_SCHEMA, {
    fetchPolicy: "network-only",
    refetchQueries: [GET_OCORRENCIAS_SCHEMA]
  });

  async function FormPut(data: any) {
    try {
      return await body({
        variables: {
          data: { ...data },
        },
        refetchQueries:[GET_OCORRENCIAS_SCHEMA]
      });

    } catch (e) {
      console.error('Erro na requisição:'+ e);
      return e
    }
  }

  return { FormPut, data, error, loading };
}

export function MutationDeleteOcorrencia(){
  const [body, { data, error, loading }] = useMutation<TypesDeleteOcorrencia>(DELETE_OCORRENCIA_SCHEMA, {
    fetchPolicy: "network-only",
    refetchQueries: [GET_OCORRENCIAS_SCHEMA]
  });

  async function FormSet(id: number) {
    try {
      return await body({
        variables: {
          observacaoId: id,
        },
        refetchQueries:[GET_OCORRENCIAS_SCHEMA]
      });

    } catch (e) {
      console.error('Erro na requisição:'+ e);
      return e
    }
  }

  return { FormSet, data, error, loading };
}