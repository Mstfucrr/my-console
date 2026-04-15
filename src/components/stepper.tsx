import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check, ChevronRight } from 'lucide-react'

export type StepperItem = {
  key: string
  label: string
  completed?: boolean
  disabled?: boolean
  onClick?: () => void
}

type StepperProps = {
  items: StepperItem[]
  activeKey: string
  className?: string
}

export function Stepper({ items, activeKey, className }: StepperProps) {
  const activeIndex = items.findIndex(item => item.key === activeKey)

  return (
    <div className={cn('flex flex-wrap items-center gap-1 text-center max-md:justify-center sm:gap-2', className)}>
      {items.map((item, index) => {
        const isActive = item.key === activeKey
        const isInteractive = typeof item.onClick === 'function'
        const isDisabled = Boolean(item.disabled)
        const isCompleted = item.completed ?? (activeIndex >= 0 && index < activeIndex)

        return (
          <div key={item.key} className='flex items-center gap-1 sm:gap-2'>
            {index > 0 && <ChevronRight className='text-muted-foreground size-4 shrink-0' aria-hidden />}
            {isInteractive ? (
              <Button
                type='button'
                onClick={item.onClick}
                disabled={isDisabled}
                size='xs'
                aria-current={isActive ? 'step' : undefined}
                variant={isActive ? undefined : 'ghost'}
              >
                {isCompleted && <Check className='mr-1 size-4 shrink-0' aria-hidden />}
                {item.label}
              </Button>
            ) : (
              <div
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted/60 text-muted-foreground px-1.5',
                  isDisabled && 'cursor-not-allowed opacity-50'
                )}
              >
                {isCompleted && <Check className='mr-1 size-4 shrink-0' aria-hidden />}
                {item.label}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
