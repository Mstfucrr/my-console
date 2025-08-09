import { formatCurrencyTRY } from '../utils'

export function OrderItemRow({
  name,
  quantity,
  price,
  notes
}: {
  name: string
  quantity: number
  price: number
  notes?: string
}) {
  return (
    <div className='border-default-200 flex items-center justify-between border-b pb-2 last:border-b-0'>
      <div className='min-w-0 pr-3'>
        <div className='truncate font-medium'>
          {quantity}x {name}
        </div>
        {notes && <div className='text-muted-foreground text-xs'>Not: {notes}</div>}
      </div>
      <div className='font-semibold'>{formatCurrencyTRY(price * quantity)}</div>
    </div>
  )
}
