import React from 'react'

type Props = {
  text: string | null
}

export const Loader: React.FC<Props> = ({text}) => {
  return (
    <div className='loader p-10'>
      <div className='flex-1 h-screen w-full absolute flex justify-center'>
        <div className='flex flex-column all-center '>
          <span className='spinner-border text-primary' role='status'></span>
          <br />
          <span className='text-muted fs-6 fw-semibold ms-5'>{text ? text : 'Carregando...'}</span>
        </div>
      </div>
    </div>
  )
}
