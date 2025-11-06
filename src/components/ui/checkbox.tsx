import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import * as React from 'react'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Check } from 'lucide-react'

const checkboxVariants = cva(
  'peer group ring-offset-background focus-visible:ring-ring [&_svg]:stroke-primary-foreground shrink-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      color: {
        default: 'border-default-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary border',
        secondary: 'border-default-300 data-[state=checked]:bg-default-300/90 border',

        destructive:
          'border-default-400 data-[state=checked]:border-destructive data-[state=checked]:bg-destructive border',
        warning: 'border-default-400 data-[state=checked]:border-warning data-[state=checked]:bg-warning border',
        info: 'border-default-400 data-[state=checked]:border-info data-[state=checked]:bg-info border',
        success: 'border-default-400 data-[state=checked]:border-success data-[state=checked]:bg-success border',
        dark: 'border-default-400 border data-[state=checked]:bg-slate-900'
      },
      variant: {
        solid: 'bg-default-600',
        plain: 'border-none bg-transparent',
        faded: 'bg-card',
        filled: 'bg-default-200',
        outline: 'data-[state=checked]:bg-card border border-current',
        'filled-outline': 'bg-default-200 data-[state=checked]:bg-card border-current'
      },
      radius: {
        none: '',
        sm: 'rounded-sm',
        base: 'rounded',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl'
      },
      size: {
        xs: 'h-3 w-3 rounded-[2px] [&_svg]:h-2.5 [&_svg]:w-2.5',
        sm: 'h-4 w-4 [&_svg]:h-3 [&_svg]:w-3',
        md: 'h-5 w-5 [&_svg]:h-4 [&_svg]:w-4',
        lg: 'h-6 w-6 [&_svg]:h-4 [&_svg]:w-4',
        xl: 'h-7 w-7 [&_svg]:h-5 [&_svg]:w-5'
      }
    },
    compoundVariants: [
      {
        variant: 'outline',
        color: 'destructive',
        className: '[&_svg]:stroke-destructive border-destructive border-destructive'
      },
      {
        variant: 'outline',
        color: 'success',
        className: '[&_svg]:stroke-success border-success'
      },
      {
        variant: 'outline',
        color: 'info',
        className: '[&_svg]:stroke-info border-info'
      },
      {
        variant: 'outline',
        color: 'warning',
        className: '[&_svg]:stroke-warning border-warning'
      },
      {
        variant: 'outline',
        color: 'dark',
        className: '[&_svg]:stroke-foreground border-foreground'
      },
      {
        variant: 'outline',
        color: 'default',
        className: '[&_svg]:stroke-primary border-primary'
      },
      {
        variant: 'filled-outline',
        color: 'default',
        className: '[&_svg]:stroke-primary border-primary'
      }
    ],

    defaultVariants: {
      color: 'default',
      size: 'md',
      radius: 'base',
      variant: 'faded'
    }
  }
)

type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants> & {
    lineThrough?: boolean
    icon?: React.ReactNode
  }

const Checkbox = ({
  className,
  color,
  size,
  radius,
  variant,
  children,
  lineThrough,
  icon = <Check />,
  ...props
}: CheckboxProps) => (
  <>
    {children ? (
      <div className='flex items-center'>
        <CheckboxPrimitive.Root
          className={cn(checkboxVariants({ color, size, radius, variant }), className)}
          {...props}
        >
          <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
            {icon}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <Label
          htmlFor={props.id}
          className={cn(
            'text-muted-foreground transition-colors-opacity before:transition-width flex-1 cursor-pointer font-normal motion-reduce:transition-none ltr:pl-2.5 rtl:pr-2.5',
            {
              'text-xs': size === 'xs',
              'text-sm': size === 'sm',
              'text-base': size === 'md',
              'text-lg': size === 'lg',
              'text-[18px]': size === 'xl',
              "text-medium before:bg-foreground relative inline-flex items-center justify-center select-none peer-data-[state=checked]:opacity-60 before:absolute before:h-0.5 before:w-0 before:content-[''] peer-data-[state=checked]:before:w-full":
                lineThrough
            }
          )}
        >
          {children}
        </Label>
      </div>
    ) : (
      <CheckboxPrimitive.Root className={cn(checkboxVariants({ color, size, radius, variant }), className)} {...props}>
        <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
          {icon}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    )}
  </>
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
