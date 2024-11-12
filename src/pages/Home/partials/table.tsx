import { Link } from 'react-router-dom';
import useSummaryFuncionario from '../../../hooks/useSummaryFuncionario'

export function TableHome() {
  const funcionarios = useSummaryFuncionario()


  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-200">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Nome
          </th>
          <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Pedidos/Realizados
          </th>
          <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Taxa de aproveitamento
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Situação
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Ações
          </th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {funcionarios.map((employee) => {

          let feedbackMessage = ''; // Mensagem padrão para 'Excelente'

          // Definindo a cor e a mensagem de acordo com a taxa de aproveitamento
          const taxaAproveitamento = employee.taxaAproveitamento
            ;
          if (taxaAproveitamento <= 25) {
            feedbackMessage = 'Ruim 😖';
          } else if (taxaAproveitamento <= 50) {
            feedbackMessage = 'Mediano 🙁';
          } else if (taxaAproveitamento <= 75) {
            feedbackMessage = 'Bom 🙂';
          } else if (taxaAproveitamento > 75) {
            feedbackMessage = 'Excelente 🤩';
          }

          return (
            <tr key={employee.id} className="border-b-2">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-bold">{employee.nome}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {employee.totalPedidos}/{employee.totalRealizados}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {employee.taxaAproveitamento.toFixed(2)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`rounded-lg px-4 py-2 `}>
                  {feedbackMessage}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link to={`infos/${employee.id}`} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Gerenciar</Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}