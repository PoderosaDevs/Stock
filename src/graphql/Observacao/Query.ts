import { useQuery } from "@apollo/client";
import { TypesGetOcorrenciaByID, TypesGetOcorrencias } from "./Types";
import { GET_OCORRENCIA_BY_ID_SCHEMA, GET_OCORRENCIAS_SCHEMA } from "./Schema";

interface QueryProps {
  variables: any
}


export function QueryGetOcorrencias({variables}:QueryProps) {
  const { data, error, loading } = useQuery<TypesGetOcorrencias>(GET_OCORRENCIAS_SCHEMA, {
    variables
  });

  return { data, error, loading };
}

export function QueryGetOcorrenciaByID({variables}:QueryProps) {
  const { data, error, loading } = useQuery<TypesGetOcorrenciaByID>(GET_OCORRENCIA_BY_ID_SCHEMA, {
    variables
  });

  return { data, error, loading };
}

