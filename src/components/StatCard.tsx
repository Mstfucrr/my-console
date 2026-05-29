import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatCurrencyTRY } from '@/lib/utils/currency'
import type { LucideIcon } from 'lucide-react'
import type { HTMLAttributes } from 'react'
import { Skeleton } from './ui/skeleton'

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean
  title: string
  value: number | undefined
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

  if (!value && value !== 0) return null

  return (
    <Card
      {...props}
      className={cn(
        'border-border/50 hover:border-border/80 rounded-lg border p-2 transition-colors duration-200 sm:p-4',
        className
      )}
    >
      <CardContent className='flex h-full flex-col justify-between p-0 sm:gap-2'>
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
        <span className={`text-foreground ph-sensitive text-xl font-semibold max-xl:text-lg max-sm:text-base`}>
          {type === 'currency' ? formatCurrencyTRY(value) : `${value} Adet`}
        </span>
      </CardContent>
    </Card>
  )
}
