import { FaRegClock } from 'react-icons/fa6'
import { LuPackageCheck, LuPackage } from 'react-icons/lu'
import useSummary from '../../hooks/useSummary'


export function SummaryHome() {
  const { totalPedidos, totalRealizados, mediaTempoPorPedido } = useSummary('month');

  return (
    <div className="max-w-[1500px] my-4 grid grid-cols-1 md:grid-cols-3 gap-8">

      <div className=" bg-white px-14 flex justify-between items-center py-8 flex-row shadow-md rounded-2xl">
        <div className='flex flex-col'>
          <span className='text-4xl font-semibold'>Pedidos</span>
          <span className='text-4xl text-amber-700'>{totalPedidos}</span>
        </div>
        <LuPackage className='text-amber-700 text-7xl' />

      </div>

      <div className=" bg-white px-14 flex justify-between items-center py-8 flex-row shadow-md rounded-2xl">
        <div className='flex flex-col'>
          <span className='text-4xl font-semibold'>Realizados</span>
          <span className='text-4xl text-green-700'>{totalRealizados}</span>
        </div>
        <LuPackageCheck className='text-green-700 text-7xl' />
      </div>

      <div className=" bg-white px-14 flex justify-between items-center py-8 flex-row shadow-md rounded-2xl">
        <div className='flex flex-col'>
          <span className='text-4xl font-semibold'>Média</span>
          <span className='text-4xl text-lime-500'>{mediaTempoPorPedido}</span>
        </div>
        <FaRegClock className='text-lime-500 text-6xl' />
      </div>
    </div>
  )
}