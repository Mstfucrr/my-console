import { cn } from '@/lib/utils'
import type { OrderLog } from '@/modules/orders/types'
import { formatDateTR } from '../utils'
import { StatusIcon } from './StatusBadge'

export function OrderLogs({ logs }: { logs: OrderLog[] }) {
  return (
    <div className='space-y-2'>
      {logs.map((log, idx) => (
        <div className='flex-col' key={log.id}>
          <div className='flex items-start gap-2'>
            <div className='mt-0.5'>
              <StatusIcon status={log.status} />
            </div>
            <div className='flex-1'>
              <div className='text-sm font-medium'>{log.message}</div>
              <div className='text-muted-foreground text-xs'>{formatDateTR(log.timestamp)}</div>
            </div>
          </div>
          <hr className={cn('bg-default-200 ml-2 h-4 w-0.5', { hidden: idx === logs.length - 1 })} />
        </div>
      ))}
    </div>
  )
}
