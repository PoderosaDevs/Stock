import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import Swal from 'sweetalert2';
import { LuPackage, LuPackageCheck } from 'react-icons/lu';
import { FaPencil } from 'react-icons/fa6';
import { format } from 'date-fns';
import { MutationPutOcorrencia } from '../../../../graphql/Observacao/Mutation';
import { QueryGetOcorrenciaByID } from '../../../../graphql/Observacao/Query';

interface Props {
  id: number;
  idOcorrencia: number;
}

export function PutReportingModal({ id, idOcorrencia }: Props) {

  const { data } = QueryGetOcorrenciaByID({
    variables: { getObservacaoByIdId: idOcorrencia },
  });

  const { FormPut } = MutationPutOcorrencia();
  const [isOpen, setIsOpen] = useState(false);


  const reportingFormSchema = z.object({
    id: z.number(),
    data: z.string().nonempty('A data é obrigatória'), // Trabalhando como string para input[type="date"]
    title: z.string().nonempty('O título é obrigatório'),
    description: z.string().nonempty('A descrição é obrigatória'),
    usuario_id: z.number().optional(),
  });

  type ReportingFormSchema = z.infer<typeof reportingFormSchema>;

  const {
    handleSubmit,
    register,
    reset, // Para sincronizar valores com os dados da query
    formState: { errors },
  } = useForm<ReportingFormSchema>({
    resolver: zodResolver(reportingFormSchema),
    defaultValues: {
      data: '',
      title: '',
      description: '',
      usuario_id: id ?? 0,
      id: idOcorrencia ?? 0
    },
  });


  useEffect(() => {
    if (data?.GetObservacaoByID) {
      const queryData = data.GetObservacaoByID;
      const formattedDate = queryData.data
        ? format(new Date(queryData.data), 'yyyy-MM-dd')
        : '';

      reset({
        id: idOcorrencia ?? 0,
        data: formattedDate,
        title: queryData.title || '',
        description: queryData.description || '',
        usuario_id: id ?? 0,
      });
    }
  }, [data, reset, id]);

  const onSubmit = async (formData: ReportingFormSchema) => {
    if (!id) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'ID do usuário não está definido.',
      });
      return;
    }

    const adjustedDate = new Date(formData.data); // Ajusta a data no formato adequado
    const formattedDate = `${adjustedDate.toISOString().slice(0, 10)} 08:00:00`;

    const payload = {
      ...formData,
      data: formattedDate,
    };

    try {
      await FormPut(payload);

      setIsOpen(false);

      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: 'Ocorrência atualizada com sucesso!',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Ocorreu um erro ao atualizar a ocorrência. Por favor, tente novamente.',
      });
    }
  };

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
            Editar Ocorrência
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                className="text-white text-[1.2rem] font-light"
                htmlFor="data_trabalho"
              >
                Data
              </label>
              <input
                {...register('data')}
                type="date"
                className="rounded-lg w-full border-0 bg-gray-900 text-gray-300 p-4 placeholder-gray-500"
              />
              {errors.data && (
                <span className="text-red-500">{errors.data.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col flex-1 gap-2">
                <label
                  className="text-white text-[1.2rem] font-semibold"
                  htmlFor="titulo"
                >
                  Título
                </label>
                <div className="relative">
                  <input
                    {...register('title')}
                    type="text"
                    className="rounded-lg w-full border-0 bg-gray-900 text-gray-300 p-4 placeholder-gray-500"
                    placeholder="Título"
                  />
                  <LuPackage className="absolute right-4 top-4 text-amber-700 text-3xl" />
                </div>
                {errors.title && (
                  <span className="text-red-500">{errors.title.message}</span>
                )}
              </div>

              <div className="flex flex-col flex-1 gap-2">
                <label
                  className="text-white text-[1.2rem] font-semibold"
                  htmlFor="description"
                >
                  Descrição
                </label>
                <div className="relative">
                  <textarea
                    {...register('description')}
                    rows={5}
                    className="rounded-lg w-full border-0 bg-gray-900 text-gray-300 p-4 placeholder-gray-500"
                    placeholder="Descrição"
                  />
                  <LuPackageCheck className="absolute right-4 top-4 text-green-700 text-3xl" />
                </div>
                {errors.description && (
                  <span className="text-red-500">{errors.description.message}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 mb-4 rounded-lg bg-green-500 text-white p-3 hover:bg-green-700"
            >
              Atualizar
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
