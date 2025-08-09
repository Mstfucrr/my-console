import * as SelectPrimitive from '@radix-ui/react-select'
import { cva, type VariantProps } from 'class-variance-authority'
import { Check, ChevronDown } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'
const selectVariants = cva(
  'read-only:bg-background flex h-10 w-full items-center justify-between px-3 text-sm transition duration-300 disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:h-5 [&>svg]:w-5',
  {
    variants: {
      color: {
        default:
          'border-default-300 text-default-500 focus:border-default-500/50 disabled:bg-default-200 placeholder:text-accent-foreground/50 [&>svg]:stroke-default-600 focus:outline-none',
        primary:
          'border-primary text-primary focus:border-primary-700 disabled:bg-primary/30 disabled:placeholder:text-primary placeholder:text-primary/70 [&>svg]:stroke-primary focus:outline-none',
        info: 'border-info/50 text-info focus:border-info-700 disabled:bg-info/30 disabled:placeholder:text-info placeholder:text-info/70 focus:outline-none',
        warning:
          'border-warning/50 text-warning focus:border-warning-700 disabled:bg-warning/30 disabled:placeholder:text-info placeholder:text-warning/70 focus:outline-none',
        success:
          'border-success/50 text-success focus:border-success-700 disabled:bg-success/30 disabled:placeholder:text-info placeholder:text-success/70 focus:outline-none',
        destructive:
          'border-destructive/50 text-destructive focus:border-destructive-700 disabled:bg-destructive/30 disabled:placeholder:text-destructive placeholder:text-destructive/70 focus:outline-none'
      },
      variant: {
        flat: 'read-only:bg-default-500/10',
        underline: 'border-b',
        bordered: 'border',
        faded: 'border-default-300 read-only:bg-default-100 border',
        ghost: 'border-0 focus:border',
        'flat-underline': 'read-only:bg-default-100 border-b'
      },
      shadow: {
        none: 'shadow-none',
        xs: 'shadow-sm',
        sm: 'shadow',
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
        sm: 'h-8 text-xs',
        md: 'h-9 text-xs',
        lg: 'h-10 text-sm',
        xl: 'h-12 text-base'
      }
    },
    compoundVariants: [
      {
        variant: 'flat',
        color: 'primary',
        className: 'read-only:bg-primary/10'
      },
      {
        variant: 'flat',
        color: 'info',
        className: 'read-only:bg-info/10'
      },
      {
        variant: 'flat',
        color: 'warning',
        className: 'read-only:bg-warning/10'
      },
      {
        variant: 'flat',
        color: 'success',
        className: 'read-only:bg-success/10'
      },
      {
        variant: 'flat',
        color: 'destructive',
        className: 'read-only:bg-destructive/10'
      },
      {
        variant: 'faded',
        color: 'primary',
        className: 'read-only:bg-primary/10 border-primary/30'
      },
      {
        variant: 'faded',
        color: 'info',
        className: 'read-only:bg-info/10 border-info/30'
      },
      {
        variant: 'faded',
        color: 'warning',
        className: 'read-only:bg-warning/10 border-warning/30'
      },
      {
        variant: 'faded',
        color: 'success',
        className: 'read-only:bg-success/10 border-success/30'
      },
      {
        variant: 'faded',
        color: 'destructive',
        className: 'read-only:bg-destructive/10 border-destructive/30'
      }
    ],
    defaultVariants: {
      color: 'default',
      size: 'lg',
      variant: 'bordered',
      radius: 'md'
    }
  }
)

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectVariants> {
  icon?: React.ReactNode
  color?: 'default' | 'primary' | 'info' | 'warning' | 'success' | 'destructive'
}

const SelectTrigger = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, SelectTriggerProps>(
  ({ className, children, color, size, radius, variant, icon = <ChevronDown />, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(selectVariants({ color, size, radius, variant }), className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>{icon}</SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
)
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 text-sm font-semibold ltr:pr-2 ltr:pl-8 rtl:pr-8 rtl:pl-2', className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className='absolute flex h-3.5 w-3.5 items-center justify-center ltr:right-2 rtl:left-2'>
      <SelectPrimitive.ItemIndicator>
        <Check className='h-4 w-4' />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn('bg-muted -mx-1 my-1 h-px', className)} {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue }
