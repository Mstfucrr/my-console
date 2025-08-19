import { InputColor, InputVariant, Radius, Shadow } from '@/lib/type'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import * as React from 'react'

export const inputVariants = cva(
  'bg-background border-default-300 read-only:bg-background h-9 w-full px-3 text-sm transition duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium read-only:leading-9 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      color: {
        default:
          'border-default-300 text-default-900 focus:border-primary disabled:bg-default-200 placeholder:text-accent-foreground/50 focus:outline-none',
        primary:
          'border-primary text-primary focus:border-primary-700 disabled:bg-primary/30 disabled:placeholder:text-primary placeholder:text-primary/70 focus:outline-none',
        info: 'border-info/50 text-info focus:border-info-700 disabled:bg-info/30 disabled:placeholder:text-info placeholder:text-info/70 focus:outline-none',
        warning:
          'border-warning/50 text-warning focus:border-warning-700 disabled:bg-warning/30 disabled:placeholder:text-info placeholder:text-warning/70 focus:outline-none',
        success:
          'border-success/50 text-success focus:border-success-700 disabled:bg-success/30 disabled:placeholder:text-info placeholder:text-success/70 focus:outline-none',
        destructive:
          'border-destructive/50 text-destructive focus:border-destructive-700 disabled:bg-destructive/30 disabled:placeholder:text-destructive placeholder:text-destructive/70 focus:outline-none'
      },
      variant: {
        flat: 'bg-default-100 read-only:bg-default-100',
        underline: 'border-b',
        bordered: 'border',
        faded: 'border-default-300 bg-default-100 border',
        ghost: 'border-0 focus:border',
        'flat-underline': 'bg-default-100 border-b'
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        '2xl': 'shadow-2xl'
      },
      radius: {
        none: 'rounded-none',
        sm: 'rounded',
        md: 'rounded-lg',
        lg: 'rounded-xl',
        xl: 'rounded-[20px]'
      },
      size: {
        sm: 'h-8 text-xs read-only:leading-8',
        md: 'h-9 text-xs read-only:leading-9',
        lg: 'h-10 text-sm read-only:leading-10',
        xl: 'h-12 text-base read-only:leading-[48px]'
      }
    },
    compoundVariants: [
      {
        variant: 'flat',
        color: 'primary',
        className: 'bg-primary/10 read-only:bg-primary/10'
      },
      {
        variant: 'flat',
        color: 'info',
        className: 'bg-info/10 read-only:bg-info/10'
      },
      {
        variant: 'flat',
        color: 'warning',
        className: 'bg-warning/10 read-only:bg-warning/10'
      },
      {
        variant: 'flat',
        color: 'success',
        className: 'bg-success/10 read-only:bg-success/10'
      },
      {
        variant: 'flat',
        color: 'destructive',
        className: 'bg-destructive/10 read-only:bg-destructive/10'
      },
      {
        variant: 'faded',
        color: 'primary',
        className: 'bg-primary/10 read-only:bg-primary/10 border-primary/30'
      },
      {
        variant: 'faded',
        color: 'info',
        className: 'bg-info/10 border-info/30'
      },
      {
        variant: 'faded',
        color: 'warning',
        className: 'bg-warning/10 border-warning/30'
      },
      {
        variant: 'faded',
        color: 'success',
        className: 'bg-success/10 border-success/30'
      },
      {
        variant: 'faded',
        color: 'destructive',
        className: 'bg-destructive/10 border-destructive/30'
      }
    ],

    defaultVariants: {
      color: 'default',
      size: 'md',
      variant: 'bordered',
      radius: 'md'
    }
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  removeWrapper?: boolean
  color?: InputColor
  variant?: InputVariant
  radius?: Radius
  shadow?: Shadow
  size?: 'sm' | 'md' | 'lg' | 'xl' | null
  Icon?: LucideIcon
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, color, radius, variant, shadow, removeWrapper = false, Icon, ...props }, ref) => {
    if (removeWrapper)
      return (
        <div className='relative'>
          {Icon && (
            <div className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2'>
              <Icon className='size-4' />
            </div>
          )}
          <input
            type={type}
            className={cn(inputVariants({ color, size, radius, variant, shadow }), Icon && 'pl-10', className)}
            ref={ref}
            {...props}
          />
        </div>
      )

    return (
      <div className='relative w-full flex-1'>
        {Icon && (
          <div className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2'>
            <Icon className='size-4' />
          </div>
        )}
        <input
          type={type}
          className={cn(inputVariants({ color, size, radius, variant, shadow }), Icon && 'pl-10', className)}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
