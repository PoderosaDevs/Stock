import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import Swal from 'sweetalert2';
import { FaPencil } from 'react-icons/fa6';
import { format } from 'date-fns';
import { MutationPutDiaTrabalho } from '../../../../graphql/DiaTrabalhado/Mutation';
import { QueryGetDiaTrabalhoByID } from '../../../../graphql/DiaTrabalhado/Query';

interface Props {
  id: number;
}

export function PutWorkDayModal({ id }: Props) {
  const { data, loading, error } = QueryGetDiaTrabalhoByID({
    variables: { getDiaTrabalhadoEstoqueByIdId: parseInt(String(id)) },
  });

  const { FormPut } = MutationPutDiaTrabalho();
  const [isOpen, setIsOpen] = useState(false);

  const updateWorkDayFormSchema = z.object({
    id: z.number(),
    data_trabalho: z.string().nonempty('A data é obrigatória'),
    horario_entrada: z.string().nonempty('A hora inicial é obrigatória'),
    horario_saida: z.string().nonempty('A hora final é obrigatória'),
    pedidos: z.number().min(1, 'Pedidos deve ser maior que 0'),
    realizados: z.number().min(1, 'Realizados deve ser maior que 0'),
  });

  type UpdateWorkDayFormSchema = z.infer<typeof updateWorkDayFormSchema>;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<UpdateWorkDayFormSchema>({
    resolver: zodResolver(updateWorkDayFormSchema),
    defaultValues: {
      data_trabalho: '',
      horario_entrada: '',
      horario_saida: '',
      pedidos: 0,
      realizados: 0,
      id: 0,
    },
  });

  console.log(errors)

  useEffect(() => {
    if (data?.GetDiaTrabalhadoEstoqueByID) {
      const queryData = data.GetDiaTrabalhadoEstoqueByID;
      reset({
        data_trabalho: queryData.data_trabalho
          ? format(new Date(queryData.data_trabalho), 'yyyy-MM-dd')
          : '',
        horario_entrada: queryData.horario_entrada || '',
        horario_saida: queryData.horario_saida || '',
        pedidos: queryData.pedidos || 0,
        realizados: queryData.realizados || 0,
        id: parseInt(String(queryData.id)) || 0,
      });
    }
  }, [data, reset, id]);

  const onSubmit = async (formData: UpdateWorkDayFormSchema) => {
    if (!id) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'ID do usuário não está definido.',
      });
      return;
    }

    try {
      await FormPut({
        variables: {
          data: {
            ...formData,
            data_trabalho: `${formData.data_trabalho}T08:00:00`,
          }
        },
      });

      setIsOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: 'Dia de trabalho atualizado com sucesso!',
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao atualizar o dia de trabalho. Por favor, tente novamente.',
      });
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar os dados.</p>;

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          className="btn-open-modal bg-green-700 p-3 rounded-md text-white mr-2"
          onClick={() => setIsOpen(true)}
        >
          <FaPencil size={18} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <div className="fixed w-screen h-screen inset-0 bg-black bg-opacity-75 z-10" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-[32rem] rounded-lg px-10 py-3 bg-gray-800 z-50">
          <h1 className="font-semibold text-white py-4 border-b-2 mb-4">
            Editar Dia de Trabalho
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" defaultValue={id} {...register('id', { valueAsNumber: true })} />
            {/* Campo de Data de Trabalho */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-[1.2rem] font-light" htmlFor="data_trabalho">
                Data de Trabalho
              </label>
              <input
                type="date"
                id="data_trabalho"
                {...register('data_trabalho')}
                className="rounded-lg w-full border-0 bg-gray-900 text-gray-300 p-4 placeholder-gray-500"
              />
              {errors.data_trabalho && <span className="text-red-500">{errors.data_trabalho.message}</span>}
            </div>

            {/* Campo de Horário de Entrada */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-[1.2rem] font-light" htmlFor="horario_entrada">
                Horário de Entrada
              </label>
              <input
                type="time"
                id="horario_entrada"
                {...register('horario_entrada')}
                className="rounded-lg w-full border-0 bg-gray-900 text-gray-300 p-4 placeholder-gray-500"
              />
              {errors.horario_entrada && <span className="text-red-500">{errors.horario_entrada.message}</span>}
            </div>

            {/* Campo de Horário de Saída */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-[1.2rem] font-light" htmlFor="horario_saida">
                Horário de Saída
              </label>
              <input
                type="time"
                id="horario_saida"
                {...register('horario_saida')}
                className="rounded-lg w-full border-0 bg-gray-900 text-gray-300 p-4 placeholder-gray-500"
              />
              {errors.horario_saida && <span className="text-red-500">{errors.horario_saida.message}</span>}
            </div>

            {/* Campo de Pedidos */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-[1.2rem] font-light" htmlFor="pedidos">
                Pedidos
              </label>
              <input
                type="number"
                id="pedidos"
                {...register('pedidos', { valueAsNumber: true })}
                className="rounded-lg w-full border-0 bg-gray-900 text-gray-300 p-4 placeholder-gray-500"
              />
              {errors.pedidos && <span className="text-red-500">{errors.pedidos.message}</span>}
            </div>

            {/* Campo de Realizados */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-[1.2rem] font-light" htmlFor="realizados">
                Realizados
              </label>
              <input
                type="number"
                id="realizados"
                {...register('realizados', { valueAsNumber: true })}
                className="rounded-lg w-full border-0 bg-gray-900 text-gray-300 p-4 placeholder-gray-500"
              />
              {errors.realizados && <span className="text-red-500">{errors.realizados.message}</span>}
            </div>


            <div className='w-full flex justify-end'>
              {/* Botão de Submissão */}
              <button type="submit" className="mt-4 px-6 py-2 mb-4 bg-blue-600 text-white rounded-lg">
                Salvar
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
