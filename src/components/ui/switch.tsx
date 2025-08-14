'use client'
import { cn } from '@/lib/utils'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const switchVariants = cva(
  'peer [&_.content-box]:text-primary-foreground group focus-visible:ring-ring focus-visible:ring-offset-background data-[state=unchecked]:bg-default-300 relative inline-flex flex-shrink-0 cursor-pointer items-center justify-start rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&_.content-box]:text-[10px] [&_.content-box>svg]:h-4 [&_.content-box>svg]:w-4',
  {
    variants: {
      color: {
        primary: 'data-[state=checked]:bg-primary',
        secondary: 'data-[state=checked]:bg-secondary',
        info: 'data-[state=checked]:bg-info',
        warning: 'data-[state=checked]:bg-warning',
        success: 'data-[state=checked]:bg-success',
        destructive: 'data-[state=checked]:bg-destructive',
        dark: 'data-[state=checked]:bg-foreground'
      },
      size: {
        sm: 'h-4 w-[30px] [&_.content-box]:text-[7px] [&_.content-box>svg]:h-2.5 [&_.content-box>svg]:w-2.5',
        md: 'h-5 w-[38px]',
        lg: 'h-6 w-[42px]'
      }
    },

    defaultVariants: {
      color: 'primary',
      size: 'md'
    }
  }
)

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {
  thumbIcon?: React.ReactNode
  thumbClass?: string
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  color?: 'primary' | 'secondary' | 'info' | 'warning' | 'success' | 'destructive' | 'dark'
}
const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, size, color, startContent, endContent, thumbClass, thumbIcon, ...props }, ref) => (
    <SwitchPrimitives.Root className={cn(switchVariants({ size, color }), className)} {...props} ref={ref}>
      {startContent && (
        <span className='content-box text-medium transition-transform-opacity absolute left-1 scale-50 opacity-0 group-data-[state=checked]:scale-100 group-data-[state=checked]:opacity-100'>
          {startContent}
        </span>
      )}
      <SwitchPrimitives.Thumb
        className={cn(
          'bg-background pointer-events-none z-10 flex h-4 w-4 origin-right items-center justify-center rounded-full shadow-lg ring-0 transition-all ltr:data-[state=checked]:ml-5 rtl:data-[state=checked]:mr-5 rtl:data-[state=unchecked]:mr-0.5',
          thumbClass,
          {
            'h-3 w-3 data-[state=checked]:ml-4': size === 'sm',
            'h-4 w-4': size === 'md',
            'h-5 w-5': size === 'lg'
          }
        )}
      >
        {thumbIcon ? thumbIcon : null}
      </SwitchPrimitives.Thumb>
      {endContent && (
        <span className='content-box text-medium transition-transform-opacity absolute right-1 z-0 opacity-100 group-data-[state=checked]:translate-x-3 group-data-[state=checked]:opacity-0'>
          {endContent}
        </span>
      )}
    </SwitchPrimitives.Root>
  )
)
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch, type SwitchProps }
