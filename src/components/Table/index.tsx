import {Card} from 'react-bootstrap'

type Props = {
  headerTitle?: string
  headerSubtTitle?: string
  headerToolbar?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
}

export const CardTables: React.FC<Props> = ({
  headerTitle,
  headerSubtTitle,
  headerToolbar,
  children,
  footer,
}) => {
  return (
    <Card className='bg-white p-6 px-12 rounded-lg'>
      <Card.Header className='align-items-center'>
        <div>
          <div className='text-2xl font-semibold text-gray-800'>{headerTitle}</div>
          <span className='text-sm mt-1 font-semibold fs-7'>{headerSubtTitle}</span>
        </div>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a user'
        >
          <div className='all-end'>{headerToolbar}</div>
        </div>
      </Card.Header>
      <Card.Body className='p-0 pt-6'>{children}</Card.Body>
      <Card.Footer className=' all-end '>{footer}</Card.Footer>
    </Card>
  )
}