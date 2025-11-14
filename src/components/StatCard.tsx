import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
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

export default function StatCard({
  title,
  value,
  Icon,
  color,
  type = 'number',
  isLoading,
  className,
  ...props
}: StatCardProps) {
  if (isLoading) return <Skeleton className='h-24 w-full' />

  return (
    <Card
      {...props}
      className={cn(
        'border-border/50 hover:border-border/80 rounded-lg border p-4 transition-colors duration-200',
        className
      )}
    >
      <CardContent className='flex h-full flex-col justify-between gap-2 p-0'>
        <div className='flex justify-between gap-4'>
          <p className='text-muted-foreground text-sm font-medium'>{title}</p>
          <div className='opacity-30'>
            {typeof Icon === 'string' ? (
              <span className={`text-2xl ${color}`}>{Icon}</span>
            ) : (
              <Icon className={`size-7 ${color}`} />
            )}
          </div>
        </div>
        <span className={`text-foreground text-xl font-semibold max-xl:text-lg`}>
          {type === 'currency' ? formatCurrencyTRY(value) : `${value} Adet`}
        </span>
      </CardContent>
    </Card>
  )
}
