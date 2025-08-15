import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatCurrencyTRY } from '@/modules/orders/utils'
import type { LucideIcon } from 'lucide-react'

export default function StatCard({
  title,
  value,
  Icon,
  hint,
  color,
  type = 'number'
}: {
  title: string
  value: number
  Icon: LucideIcon | string
  hint: string
  color: string
  type?: 'number' | 'currency'
}) {
  return (
    <Card>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <div className='text-muted-foreground text-xs'>{title}</div>
            <div className='mt-1 flex items-center gap-2'>
              {typeof Icon === 'string' ? (
                <span className={cn('text-primary text-2xl', color)}>{Icon}</span>
              ) : (
                <Icon className={cn('text-primary size-5', color)} />
              )}
              <div className='text-foreground text-2xl font-medium'>
                {type === 'currency' ? formatCurrencyTRY(value) : value} {type === 'currency' ? '' : 'Adet'}
              </div>
            </div>
            <div className='text-muted-foreground mt-1 text-xs'>{hint}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
