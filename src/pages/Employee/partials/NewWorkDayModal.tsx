import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Swal from 'sweetalert2';
import { LuPackage, LuPackageCheck } from 'react-icons/lu';
import { MutationSetDiaTrabalho } from '../../../graphql/DiaTrabalhado/Mutation';

interface Props {
  id: number | undefined;
  date: Date | undefined;
}

export function NewWorkDayModal({ id, date }: Props) {
  const { FormSet } = MutationSetDiaTrabalho();

  const addWorkDayFormSchema = z.object({
    data_trabalho: z.date({ required_error: 'A data é obrigatória' }),
    horario_entrada: z.string({ required_error: 'A hora inicial é obrigatória' }),
    horario_saida: z.string({ required_error: 'A hora final é obrigatória' }),
    pedidos: z.number().min(1, { message: 'Pedidos deve ser maior que 0' }),
    realizados: z.number().min(1, { message: 'Realizados deve ser maior que 0' }),
    usuarioId: z.number()
  });

  type AddWorkDayFormSchema = z.infer<typeof addWorkDayFormSchema>;

  const { handleSubmit, register, formState: { errors } } = useForm<AddWorkDayFormSchema>({
    resolver: zodResolver(addWorkDayFormSchema),
    defaultValues: {
      data_trabalho: date ? new Date(date) : new Date(),
      horario_entrada: '',
      horario_saida: '',
      usuarioId: id ?? 0,
    },
  });

  const onSubmit = async (formData: AddWorkDayFormSchema) => {
    if (!id) {
      throw new Error('ID não está definido');
    }

    // Ajustar a data para UTC-3
    const localDate = new Date(formData.data_trabalho);
    const adjustedDate = new Date(localDate.getTime() - (3 * 60 * 60 * 1000) + (4 * 60 * 60 * 1000)); // Subtrai 3 horas e adiciona 4 horas
    // Formatar a data para 'yyyy-MM-dd HH:mm:ss'
    const formattedDataTrabalho = `${adjustedDate.toISOString().slice(0, 10)} 00:00:00`; // Formato desejado

    try {
      await FormSet({
        ...formData,
        data_trabalho: formattedDataTrabalho, // Usa a data ajustada e formatada
        usuarioId: id,
      });
      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: 'Dia de trabalho adicionado com sucesso!',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Ocorreu um erro ao adicionar o dia de trabalho. Por favor, tente novamente.',
      });
    }
  };

  return (
    <Dialog.Portal>
      <div className="fixed w-screen h-screen inset-0 bg-black bg-opacity-75" />
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-[32rem] rounded-lg px-10 py-3 bg-gray-800 z-50">
        <h1 className="font-semibold text-white py-4 border-b-2 mb-4">Novo dia de trabalho</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-white text-[1.2rem] font-light" htmlFor="data_trabalho">Data</label>
            <input
              {...register('data_trabalho', { valueAsDate: true })}
              type="date"
              className="rounded-lg w-full border-0 bg-gray-900 text-gray-300 p-4 placeholder-gray-500"
            />
            {errors.data_trabalho && <span className="text-red-500">{errors.data_trabalho.message}</span>}
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col flex-1 gap-2">
              <label className="text-white text-[1.2rem] font-semibold" htmlFor="horario_entrada">Hora Inicial</label>
              <input
                {...register('horario_entrada')}
                type="time"
                className="rounded-lg w-full border-0 bg-gray-900 text-gray-300 p-4 placeholder-gray-500"
                placeholder="Hora Inicial"
              />
              {errors.horario_entrada && <span className="text-red-500">{errors.horario_entrada.message}</span>}
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <label className="text-white text-[1.2rem] font-semibold" htmlFor="horario_saida">Hora Final</label>
              <input
                {...register('horario_saida')}
                type="time"
                className="rounded-lg w-full border-0 bg-gray-900 text-gray-300 p-4 placeholder-gray-500"
                placeholder="Hora Final"
              />
              {errors.horario_saida && <span className="text-red-500">{errors.horario_saida.message}</span>}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col flex-1 gap-2">
              <label className="text-white text-[1.2rem] font-semibold" htmlFor="pedidos">Pedidos</label>
              <div className="relative">
                <input
                  {...register('pedidos', { valueAsNumber: true })}
                  type="number"
                  min={0}
                  className="rounded-lg w-full border-0 bg-gray-900 text-gray-300 p-4 placeholder-gray-500"
                  placeholder="Pedidos"
                />
                <LuPackage className="absolute right-4 top-4 text-amber-700 text-3xl" />
              </div>
              {errors.pedidos && <span className="text-red-500">{errors.pedidos.message}</span>}
            </div>

            <div className="flex flex-col flex-1 gap-2">
              <label className="text-white text-[1.2rem] font-semibold" htmlFor="realizados">Realizados</label>
              <div className="relative">
                <input
                  {...register('realizados', { valueAsNumber: true })}
                  type="number"
                  min={0}
                  className="rounded-lg w-full border-0 bg-gray-900 text-gray-300 p-4 placeholder-gray-500"
                  placeholder="Realizados"
                />
                <LuPackageCheck className="absolute right-4 top-4 text-green-700 text-3xl" />
              </div>
              {errors.realizados && <span className="text-red-500">{errors.realizados.message}</span>}
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 mb-4 rounded-lg bg-green-500 text-white p-3 hover:bg-green-700"
          >
            Adicionar
          </button>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
