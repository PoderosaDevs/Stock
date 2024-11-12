import { useQuery } from "@apollo/client";
import { GetFuncionarioTypes } from "./Types";
import { GET_FUNCIONARIOS_ESTOQUE_SCHEMA } from "./Schema";



export function QueryGetFuncionarios() {
  const { data, error, loading } = useQuery<GetFuncionarioTypes>(GET_FUNCIONARIOS_ESTOQUE_SCHEMA);

  return { data, error, loading };
}
