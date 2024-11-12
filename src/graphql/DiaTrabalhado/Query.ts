import { useQuery } from "@apollo/client";
import { GET_ALL_DIAS_TRABALHO_SCHEMA, GET_DIAS_TRABALHO_SCHEMA } from "./Schema";
import { TypesGetAllDiasTrabalho, TypesGetDiasTrabalho } from "./Types";

interface QueryProps {
  variables: any
  skip?: boolean
}

export function QueryAllGetDiasTrabalho({variables}: QueryProps) {
  const {data, loading, error} = useQuery<TypesGetAllDiasTrabalho>(GET_ALL_DIAS_TRABALHO_SCHEMA, {
    variables,
    fetchPolicy: "network-only",
  });

  return {data, loading, error}
}

export function QueryGetDiasTrabalho({variables}: QueryProps) {
  const {data, loading, error} = useQuery<TypesGetDiasTrabalho>(GET_DIAS_TRABALHO_SCHEMA, {
    variables,
    fetchPolicy: "network-only",
  });

  return {data, loading, error}
}