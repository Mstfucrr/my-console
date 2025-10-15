import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatCurrencyTRY } from '@/modules/orders/utils'
import type { LucideIcon } from 'lucide-react'
import type { HTMLAttributes } from 'react'
import { Skeleton } from './ui/skeleton'

type StatCardSize = 'sm' | 'md'

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean
  title: string
  value: number
  Icon: LucideIcon | string
  hint: string
  color: string
  type?: 'number' | 'currency'
  size?: StatCardSize
}

const sizeVariants = {
  md: {
    cardPadding: 'p-4',
    icon: 'size-5 text-2xl',
    title: 'text-xs',
    value: 'font-medium xl:text-2xl',
    hint: 'text-xs mt-1'
  },
  sm: {
    cardPadding: 'p-2',
    icon: 'size-4 text-lg',
    title: 'text-[11px]',
    value: 'font-medium text-base',
    hint: 'text-[10px] mt-1'
  }
}

export default function StatCard({
  title,
  value,
  Icon,
  hint,
  color,
  type = 'number',
  isLoading,
  size = 'md',
  ...props
}: StatCardProps) {
  const variant = sizeVariants[size]

  if (isLoading) return <Skeleton className={size === 'sm' ? 'h-16 w-full' : 'h-24 w-full'} />

  return (
    <Card {...props}>
      <CardContent className={cn(variant.cardPadding, 'h-full')}>
        <div className='flex h-full items-center justify-center'>
          <div className='flex flex-col items-center justify-center'>
            <div className={cn('text-muted-foreground', variant.title)}>{title}</div>
            <div className='mt-1 flex items-center gap-2'>
              {typeof Icon === 'string' ? (
                <span className={cn('text-primary', variant.icon, color)}>{Icon}</span>
              ) : (
                <Icon className={cn('text-primary', variant.icon, color)} />
              )}
              <span className={cn('text-foreground', variant.value)}>
                {type === 'currency' ? formatCurrencyTRY(value) : value}
                {type === 'currency' ? '' : ' Adet'}
              </span>
            </div>
            <div className={cn('text-muted-foreground', variant.hint)}>{hint}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
