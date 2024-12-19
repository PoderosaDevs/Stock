import { Loader } from "../Loader"

const LoadingTable = ({loading}:any) => {
  return loading ? (
    <tr>
      <td colSpan={10} className='text-center'>
        <Loader text={'Carregando...'}></Loader>
      </td>
    </tr>
  ) : (
    <></>
  )
}

export default LoadingTable
