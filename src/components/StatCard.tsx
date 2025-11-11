import { Card, CardContent } from '@/components/ui/card'
import { formatCurrencyTRY } from '@/modules/orders/utils'
import type { LucideIcon } from 'lucide-react'
import type { HTMLAttributes } from 'react'
import { Skeleton } from './ui/skeleton'

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean
  title: string
  value: number
  Icon: LucideIcon | string
  color: string
  type?: 'number' | 'currency'
}

export default function StatCard({ title, value, Icon, color, type = 'number', isLoading, ...props }: StatCardProps) {
  if (isLoading) return <Skeleton className='h-24 w-full' />

  return (
    <Card
      {...props}
      className='border-border/50 hover:border-border/80 rounded-lg border p-4 transition-colors duration-200'
    >
      <CardContent className='flex items-start justify-between gap-4 p-0'>
        <div>
          <p className='text-muted-foreground mb-3 text-sm font-medium'>{title}</p>
          <span className={`text-foreground text-xl font-semibold max-xl:text-lg`}>
            {type === 'currency' ? formatCurrencyTRY(value) : `${value} Adet`}
          </span>
        </div>
        <div className='opacity-30'>
          {typeof Icon === 'string' ? (
            <span className={`text-2xl ${color}`}>{Icon}</span>
          ) : (
            <Icon className={`size-7 ${color}`} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
