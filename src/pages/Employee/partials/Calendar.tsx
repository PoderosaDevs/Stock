import { useState } from 'react';
import { Calendar, SlotInfo, dateFnsLocalizer } from 'react-big-calendar';
import { format, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link, useParams } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './custom.css';
import { NewWorkDayModal } from './NewWorkDayModal';
import { QueryGetDiasTrabalho } from '../../../graphql/DiaTrabalhado/Query';
import { FaTrash } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import { MutationDeleteDiaTrabalho } from '../../../graphql/DiaTrabalhado/Mutation';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  startOfWeek,
  getDay,
  locales,
});

interface Params {
  id: string;
  [key: string]: string | undefined;
}

export function CalendarEmployee() {
  const { id } = useParams<Params>();
  const { data } = QueryGetDiasTrabalho({
    variables: {
      usuarioId: id ? parseInt(id) : 0,
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [view, setView] = useState<'calendar' | 'table'>('calendar');

  const workDays = data?.GetDiasTrabalhadosEstoque || [];

  const events = workDays
    .map((work) => {
      const date = new Date(work.data_trabalho);
      if (isNaN(date.getTime())) return null;

      return {
        title: `Pedidos: ${work.pedidos}, Realizados: ${work.realizados}`,
        start: date,
        end: date,
        allDay: true,
      };
    })
    .filter((event): event is NonNullable<typeof event> => event !== null);

  const handleOpenDialog = (slotInfo: SlotInfo) => {
    setIsOpen(true);
    setSelectedDate(slotInfo.start as Date);
  };

  const {FormSet} = MutationDeleteDiaTrabalho()

  const handleDelete = (workId: number) => {
    // Exibe o SweetAlert2 para confirmação
    Swal.fire({
      title: 'Tem certeza?',
      text: "Esta ação não pode ser desfeita!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        const id = String(workId)
        // Aqui você pode realizar a lógica de exclusão, como chamar uma API
        // Exemplo:
        FormSet(parseInt(id));
        Swal.fire(
          'Deletado!',
          'O dia de trabalho foi excluído.',
          'success'
        );
      }
    });
  };

  return (
    <div className="p-4">
      <div className='w-full flex flex-row pb-3 justify-between items-center'>
        <h1 className="text-2xl mb-4">Performance do funcionário:</h1>
        <div className='flex gap-2'>
          <Link to={'/'} className='bg-gray-700 px-4 py-2 rounded-md text-white'>
            Voltar
          </Link>
          <button className='bg-gray-900 px-4 py-2 rounded-md text-white' onClick={() => setView(view === 'table' ? 'calendar' : 'table')}>
            {view === 'table' ? 'Calendário' : 'Tabela'}
          </button>
          <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger />
            <NewWorkDayModal id={id ? parseInt(id) : 0} date={selectedDate ? selectedDate : new Date()} />
          </Dialog.Root>
        </div>
      </div>
      <hr className='pt-6' />

      {view === 'table' ? (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Data</th>
              <th className="border border-gray-300 p-2">Horário de Entrada</th>
              <th className="border border-gray-300 p-2">Horário de Saída</th>
              <th className="border border-gray-300 p-2">Demanda Diária</th>
              <th className="border border-gray-300 p-2">Pedidos Realizados</th>
              <th className="border border-gray-300 p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {workDays.map((work, index) => (
              <tr key={index}>
                <td className="border text-center border-gray-300 p-2">{format(new Date(work.data_trabalho), 'dd/MM/yyyy')}</td>
                <td className="border text-center border-gray-300 p-2">{work.horario_entrada}</td>
                <td className="border text-center border-gray-300 p-2">{work.horario_saida}</td>
                <td className="border text-center border-gray-300 p-2">{work.pedidos}</td>
                <td className="border text-center border-gray-300 p-2">{work.realizados}</td>
                <td className="border text-center border-gray-300 p-2">
                  <button 
                    className='bg-rose-600 text-white p-3 rounded-lg'
                    onClick={() => handleDelete(work.id)} // Passando o ID do trabalho para a função de deletar
                  >
                    <FaTrash size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          <Calendar
            localizer={localizer}
            events={events}
            culture="pt-BR"
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            selectable
            onSelectSlot={handleOpenDialog}
          />
        </div>
      )}
    </div>
  );
}
