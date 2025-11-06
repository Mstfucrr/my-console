import { cn } from '@/lib/utils'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cva, type VariantProps } from 'class-variance-authority'

const tooltipVariants = cva(
  'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-md',
  {
    variants: {
      color: {
        secondary: 'bg-popover text-popover-foreground border',
        primary: 'border-primary bg-primary text-primary-foreground border',
        warning: 'border-warning bg-warning text-warning-foreground border',
        info: 'border-info bg-info text-info-foreground border',
        success: 'border-success bg-success text-success-foreground border',
        destructive: 'border-destructive bg-destructive text-destructive-foreground border'
      }
    },
    defaultVariants: {
      color: 'primary'
    }
  }
)

type TooltipProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
  VariantProps<typeof tooltipVariants> & {
    color?: 'primary' | 'secondary' | 'warning' | 'info' | 'success' | 'destructive'
  }

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider> & { delayDuration?: number }) {
  return <TooltipPrimitive.Provider {...props} delayDuration={delayDuration} />
}

const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipArrow = TooltipPrimitive.Arrow

function TooltipContent({ className, sideOffset = 4, color, children, ...props }: TooltipProps) {
  return (
    <TooltipPrimitive.Content sideOffset={sideOffset} className={cn(tooltipVariants({ color }), className)} {...props}>
      {children}
    </TooltipPrimitive.Content>
  )
}

export { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger }
