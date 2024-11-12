import { useState } from 'react';
import { Calendar, SlotInfo, dateFnsLocalizer } from 'react-big-calendar';
import { format, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useParams } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './custom.css';
import { NewWorkDayModal } from './NewWorkDayModal';
import { QueryGetDiasTrabalho } from '../../../graphql/DiaTrabalhado/Query';

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

  return (
    <div className="p-4">
      <div className='w-full flex flex-row pb-3 justify-between items-center'>
        <h1 className="text-2xl mb-4">Performace do funcionario: </h1>
        <button className='bg-gray-900 px-4 py-2 rounded-md text-white' onClick={() => setView(view === 'table' ? 'calendar' : 'table')}>
          {view === 'table' ? 'Calendário' : 'Tabela'}
        </button>
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
          <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger />
            <NewWorkDayModal id={id ? parseInt(id) : 0} date={selectedDate} />
          </Dialog.Root>
        </div>
      )}
    </div>
  );
}
