'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Minus, Plus, Trash2 } from 'lucide-react'

interface B2BCartQuantityButtonsProps {
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
  className?: string
}

export function B2BCartQuantityButtons({ quantity, onIncrement, onDecrement, className }: B2BCartQuantityButtonsProps) {
  const isRemove = quantity <= 1

  return (
    <div
      className={cn(
        'bg-muted/50 flex w-full items-center justify-between gap-0.5 rounded-lg p-0.5 sm:w-auto sm:justify-start sm:gap-1 sm:rounded-xl sm:p-1',
        className
      )}
    >
      <Button
        type='button'
        size='icon-xs'
        variant='outline'
        color='secondary'
        className={cn(isRemove && 'border-destructive/30 text-destructive hover:text-destructive')}
        onClick={e => {
          e.stopPropagation()
          onDecrement()
        }}
        aria-label={isRemove ? 'Urunu sepetten cikar' : 'Adet azalt'}
      >
        {isRemove ? <Trash2 className='size-4' /> : <Minus className='size-4' />}
      </Button>
      <span className='text-foreground w-5 min-w-0 text-center text-xs font-semibold sm:w-8 sm:text-base'>
        {quantity}
      </span>
      <Button
        type='button'
        size='icon-xs'
        onClick={e => {
          e.stopPropagation()
          onIncrement()
        }}
        aria-label='Adet artir'
      >
        <Plus className='size-4' />
      </Button>
    </div>
  )
}
