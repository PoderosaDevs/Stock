import { Link } from 'react-router-dom';
import useSummaryFuncionario from '../../../hooks/useSummaryFuncionarios';

export function TableHome() {
  const funcionarios = useSummaryFuncionario();

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
        {funcionarios.map((employee) => {

         
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
        })}
      </tbody>
    </table>
  );
}
