import { useState } from 'react';
import { Calendar, SlotInfo, dateFnsLocalizer } from 'react-big-calendar';
import { format, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link, useParams } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './custom.css';
import { NewWorkDayModal } from './modals/NewWorkDayModal';

import { QueryGetDiasTrabalho } from '../../../graphql/DiaTrabalhado/Query';
import { FaTrash } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import { MutationDeleteDiaTrabalho } from '../../../graphql/DiaTrabalhado/Mutation';
import { QueryGetOcorrencias } from '../../../graphql/Observacao/Query';
import { CardTables } from '../../../components/Table';
import { MutationDeleteOcorrencia } from '../../../graphql/Observacao/Mutation';
import LoadingTable from '../../../components/Table/LoadingTable';
import ErrorTable from '../../../components/Table/ErrorTable';
import { NewReportingModal } from './modals/NewReportingModal';
import { PutReportingModal } from './modals/PutReportingModal';
import {PutWorkDayModal} from './modals/PutWorkDayModal';

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
  const { data, loading: LoadingDias, error: ErrorDias } = QueryGetDiasTrabalho({
    variables: {
      usuario_id: id ? parseInt(id) : 0,
    },
  });

  const { data: DataOcorrencias, loading: LoadingOcorrencias, error: ErrorOcorrencias } = QueryGetOcorrencias({
    variables: {
      userId: id ? parseInt(id) : 0,
    },
  })


  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [view, setView] = useState<'calendar' | 'table' | 'reporting'>('calendar');

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

  const { FormSet } = MutationDeleteDiaTrabalho();
  const { FormSet: formSetDelete } = MutationDeleteOcorrencia();

  const handleDelete = (workId: number) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        FormSet(parseInt(String(workId)));
        Swal.fire('Deletado!', 'O dia de trabalho foi excluído.', 'success');
      }
    });
  };

  const handleDeleteOcorrencia = (ocorrenciaID: number) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        formSetDelete(ocorrenciaID);
        Swal.fire('Deletado!', 'Ocorrência foi excluída.', 'success');
      }
    });
  };



  return (
    <div className="p-4">
      <div className="w-full flex flex-row pb-3 justify-between items-center">
        <h1 className="text-2xl mb-4">Performance do funcionário:</h1>
        <div className="flex gap-2">
          <Link to={'/'} className="bg-gray-700 px-4 py-2 rounded-md text-white">
            Voltar
          </Link>
          <button
            className="bg-gray-900 px-4 py-2 rounded-md text-white"
            onClick={() => setView(view === 'table' ? 'calendar' : 'table')}
          >
            {view === 'table' ? 'Calendário' : 'Tabela'}
          </button>
          <button
            className="bg-gray-900 px-4 py-2 rounded-md text-white"
            onClick={() => setView(view === 'reporting' ? 'calendar' : 'reporting')}
          >
            {view === 'reporting' ? 'Calendário' : 'Ocorrências'}
          </button>
          <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger />
            {view === 'reporting' && (
              <NewReportingModal id={id ? parseInt(id) : 0} date={selectedDate || new Date()} />
            )}
            {view === 'calendar' && (
              <NewWorkDayModal id={id ? parseInt(id) : 0} date={selectedDate || new Date()} />
            )}
          </Dialog.Root>
        </div>
      </div>
      <hr className="pt-6" />

      {view === 'calendar' ? (
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
      ) : view === 'table' ? (
        <CardTables
          headerTitle={"Lista de Dias de trabalho"}
          headerSubtTitle={workDays.length === 0 ? 'Nenhum dia registrado' : `${workDays.length} dias registrados.`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">Data</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">Horário de Entrada</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">Horário de Saída</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">Demanda</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">Realizados</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-800">Ações</th>
                </tr>
              </thead>
              <tbody>
                <LoadingTable loading={LoadingDias} />
                <ErrorTable error={ErrorDias} />
                {workDays ? (
                  workDays.length > 0 ? (
                    workDays.map((response) => {
                      return (
                        <tr key={response.id} className="hover:bg-gray-100">
                          <td className="px-4 font-semibold py-2 text-sm text-gray-700 gap-1">
                            {response.id}
                          </td>
                          <td className="px-4 font-semibold py-2 text-sm text-gray-700 gap-1">
                            {new Date(response.data_trabalho).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit'
                            })}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            <span className="font-semibold text-gray-800">{response.horario_entrada}</span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            <span className="font-semibold text-gray-800">{response.horario_saida}</span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            <span className="font-semibold text-gray-800">{response.pedidos}</span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            <span className="font-semibold text-gray-800">{response.realizados}</span>
                          </td>
                          <td className="px-4 py-2 text-right">
                            <PutWorkDayModal
                              id={response.id ? response.id : 0}
                            />
                            <button
                              onClick={() => {
                                handleDelete(response.id);
                              }}
                              disabled={LoadingDias}
                              className="btn btn-icon bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 p-3 rounded-md text-white"
                            >
                              <FaTrash size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={12} className="px-4 py-2 text-center text-sm text-gray-500">
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  )
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
        </CardTables>

      ) : (
        <CardTables
          headerTitle={'Lista de Ocorrências'}
          headerSubtTitle={DataOcorrencias?.GetObservacoes.pageInfo.totalItems === 0 ? 'Nenhuma ocorrência registrada' : `${DataOcorrencias?.GetObservacoes.pageInfo.totalItems} ocorrências registrados.`}
        >
          <div className="overflow-x-auto pt-3">
            <table className="min-w-full border-collapse divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">Data</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">Titulo</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">Descrição</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-800">Ações</th>
                </tr>
              </thead>
              <tbody>
                <LoadingTable loading={LoadingOcorrencias} />
                <ErrorTable error={ErrorOcorrencias} />
                {DataOcorrencias?.GetObservacoes.result ? (
                  DataOcorrencias?.GetObservacoes.pageInfo.totalItems > 0 ? (
                    DataOcorrencias?.GetObservacoes.result.map((response) => {
                      return (
                        <tr key={response.id} className="hover:bg-gray-100">
                          <td className="px-4 py-2 text-md">{response.id}</td>
                          <td className="px-4 py-2 text-md">
                            {new Date(response.data).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit'
                            })}
                          </td>
                          <td className="px-4 py-2">
                            <span className="text-md">{response.title}</span>
                          </td>
                          <td className="px-4 py-2">
                            <span className="text-md">{response.description}</span>
                          </td>

                          <td className="px-4 py-2 text-right">
                            {view === 'reporting' && (
                              <PutReportingModal
                                id={id ? parseInt(id) : 0}
                                idOcorrencia={response.id}
                              />
                            )}
                            <button
                              onClick={() => {
                                handleDeleteOcorrencia(response.id);
                              }}
                              disabled={LoadingOcorrencias}
                              className="btn btn-icon bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 p-3 rounded-md text-white"
                            >
                              <FaTrash size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={12} className="px-4 py-2 text-center text-sm text-gray-500">
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  )
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
        </CardTables>
      )}


    </div>
  );
}
