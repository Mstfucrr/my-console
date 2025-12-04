import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

interface TooltippedElementProps {
  children: React.ReactNode
  tooltipContent: React.ReactNode
  tooltipProps?: React.ComponentProps<typeof Tooltip>
  triggerProps?: React.ComponentProps<typeof TooltipTrigger>
}

export function TooltippedElement({
  children,
  tooltipContent,
  tooltipProps,
  triggerProps,
  ...props
}: TooltippedElementProps & React.ComponentProps<typeof TooltipContent>) {
  return (
    <TooltipProvider>
      <Tooltip {...tooltipProps}>
        <TooltipTrigger asChild {...triggerProps}>
          {children}
        </TooltipTrigger>
        <TooltipContent {...props}>{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
