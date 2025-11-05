import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { type DialogProps } from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { Command as CommandPrimitive } from 'cmdk'
import { ChevronDown, Search } from 'lucide-react'
import * as React from 'react'

type CommandDialogProps = DialogProps

const commandTriggerVariants = cva(
  'read-only:bg-background flex h-9 w-full items-center justify-between px-3 text-sm transition duration-300 disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:h-5 [&>svg]:w-5',
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

interface CommandTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof commandTriggerVariants> {
  icon?: React.ReactNode
  color?: 'default' | 'primary' | 'info' | 'warning' | 'success' | 'destructive'
}

const CommandTrigger = ({
  className,
  children,
  color,
  size,
  radius,
  variant,
  icon = <ChevronDown />,
  ...props
}: CommandTriggerProps) => (
  <button
    type='button'
    role='combobox'
    aria-controls={props['aria-controls']}
    aria-expanded={props['aria-expanded']}
    className={cn(commandTriggerVariants({ color, size, radius, variant }), className)}
    {...props}
  >
    {children}
    {icon}
  </button>
)
CommandTrigger.displayName = 'CommandTrigger'

const Command = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof CommandPrimitive>) => (
  <CommandPrimitive
    className={cn(
      'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
      className
    )}
    {...props}
  />
)
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className='overflow-hidden p-0 shadow-lg'>
        <Command className='**:[[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group]]:px-2 **:[[cmdk-input]]:h-12 **:[[cmdk-item]]:px-2 **:[[cmdk-item]]:py-3'>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

interface CommandInputProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> {
  inputWrapper?: string
}
const CommandInput = ({ className, inputWrapper, ...props }: CommandInputProps) => (
  <div className={cn('flex items-center gap-2 border-b px-3', inputWrapper)} cmdk-input-wrapper=''>
    <Search className='size-4 shrink-0 opacity-50' />
    <CommandPrimitive.Input
      className={cn(
        'placeholder:text-muted-foreground flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  </div>
)

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>) => (
  <CommandPrimitive.List className={cn('max-h-[300px] overflow-x-hidden overflow-y-auto', className)} {...props} />
)

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = (props: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>) => (
  <CommandPrimitive.Empty className='py-6 text-center text-sm' {...props} />
)

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>) => (
  <CommandPrimitive.Group
    className={cn(
      'text-foreground **:[[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium',
      className
    )}
    {...props}
  />
)

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>) => (
  <CommandPrimitive.Separator className={cn('bg-border -mx-1 h-px', className)} {...props} />
)
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>) => (
  <CommandPrimitive.Item
    className={cn(
      'relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none',
      'aria-selected:bg-accent aria-selected:text-accent-foreground',
      { 'pointer-events-none opacity-50': props.disabled },
      className
    )}
    {...props}
  />
)

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn('text-muted-foreground text-xs tracking-widest', className)} {...props} />
}
CommandShortcut.displayName = 'CommandShortcut'

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  CommandTrigger
}
