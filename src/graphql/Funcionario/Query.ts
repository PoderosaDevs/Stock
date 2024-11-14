import { useQuery } from "@apollo/client";
import { GetFuncionarioByIDTypes, GetFuncionariosTypes } from "./Types";
import { GET_FUNCIONARIO_ESTOQUE_BY_ID_SCHEMA, GET_FUNCIONARIOS_ESTOQUE_SCHEMA } from "./Schema";

interface QueryProps {
  variables: any
}


export function QueryGetFuncionarios() {
  const { data, error, loading } = useQuery<GetFuncionariosTypes>(GET_FUNCIONARIOS_ESTOQUE_SCHEMA);

  return { data, error, loading };
}

export function QueryGetFuncionarioByID({variables}:QueryProps){
  const { data, error, loading } = useQuery<GetFuncionarioByIDTypes>(GET_FUNCIONARIO_ESTOQUE_BY_ID_SCHEMA,{
    variables
  });

  return { data, error, loading };
}