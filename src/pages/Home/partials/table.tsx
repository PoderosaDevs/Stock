import { Link } from 'react-router-dom';
import useSummaryFuncionario from '../../../hooks/useSummaryFuncionarios';
import { useState, useEffect } from 'react';

export function TableHome() {
  const [isLoading, setIsLoading] = useState(true); // Estado para controle do loading
  const funcionarios = useSummaryFuncionario();

  useEffect(() => {
    if (funcionarios && funcionarios.length > 0) {
      setIsLoading(false); // Define como false quando os dados estão disponíveis
    }
  }, [funcionarios]); // Quando funcionarios mudar, verificar se já foi carregado

  return (
    <table className="w-full divide-y divide-gray-200">
      <thead className="bg-gray-200">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Nome
          </th>
          <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Pedidos/Realizados
          </th>
          <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider sm:hidden md:hidden">
            Taxa de aproveitamento
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider ">
            Ações
          </th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {isLoading ? (
          <tr>
            <td colSpan={4} className="px-6 py-4 text-center">
              <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4V2m0 20v-2m8-8h2m-20 0H2m4.22-4.22l1.42-1.42m12.72 12.72l1.42-1.42M4 12H2m20 0h-2m-4.22-4.22l-1.42-1.42m-12.72 12.72l-1.42-1.42" />
              </svg>
              <p>Carregando...</p>
            </td>
          </tr>
        ) : (
          funcionarios.map((employee) => {
            return (
              <tr key={employee.id} className="border-b-2">
                <td className="px-6 py-4 whitespace-nowrap  md:p-0">
                  <div className="flex items-center">
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-bold">{employee.nome}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center  md:p-0">
                  {employee.totalPedidos}/{employee.totalRealizados}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center md:p-0 sm:hidden md:hidden">
                  {employee.taxaAproveitamento.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-end">
                  <Link to={`infos/${employee.id}`} className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">Gerenciar</Link>
                  <Link to={`overview-employee/${employee.id}`} className="bg-slate-800 text-white px-4 py-2 rounded-lg">Visualizar</Link>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
