import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export default function StatCard({
  title,
  value,
  Icon,
  hint,
  color
}: {
  title: string
  value: number
  Icon: LucideIcon
  hint: string
  color: string
}) {
  return (
    <Card>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <div className='text-muted-foreground text-xs'>{title}</div>
            <div className='flex items-center gap-2'>
              <Icon className={cn('text-primary size-7', color)} />
              <div className='text-foreground mt-1 text-2xl font-medium'>{value} Adet</div>
            </div>
            <div className='text-muted-foreground mt-1 text-xs'>{hint}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
