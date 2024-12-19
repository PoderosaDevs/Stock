const ErrorTable = ({error} : any) => {
  return error ? (
    <tr>
      <td colSpan={10} className='text-center'>
        Erro ao consultar os dados, por favor entre em contato contato@urbit.com.br
      </td>
    </tr>
  ) : (
    <></>
  )
}

export default ErrorTable
