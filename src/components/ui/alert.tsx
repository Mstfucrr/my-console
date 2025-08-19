'use client'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import * as React from 'react'

const alertVariants = cva(
  'relative grid w-full grid-cols-[0_1fr] items-start rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      color: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        success: 'bg-success text-success-foreground',
        info: 'bg-info text-info-foreground',
        warning: 'bg-warning text-warning-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        dark: 'bg-gray-950 text-slate-50'
      },
      variant: {
        outline: 'bg-background border border-current',
        soft: 'bg-opacity-10 border-current text-current'
      }
    },
    compoundVariants: [
      {
        variant: 'outline',
        color: 'destructive',
        className: 'text-destructive bg-destructive/5'
      },
      {
        variant: 'outline',
        color: 'success',
        className: 'text-success bg-success/5'
      },
      {
        variant: 'outline',
        color: 'info',
        className: 'text-info bg-info/5'
      },
      {
        variant: 'outline',
        color: 'warning',
        className: 'bg-warning/20 text-warning-foreground border-warning'
      },
      {
        variant: 'outline',
        color: 'dark',
        className: 'text-dark bg-dark/5'
      },

      {
        variant: 'outline',
        color: 'secondary',
        className: 'text-default-700 dark:text-default-400 bg-secondary/5'
      },
      // soft

      {
        variant: 'soft',
        color: 'info',
        className: 'text-info'
      },
      {
        variant: 'soft',
        color: 'warning',
        className: 'text-warning'
      },
      {
        variant: 'soft',
        color: 'destructive',
        className: 'text-destructive'
      },
      {
        variant: 'soft',
        color: 'success',
        className: 'text-success'
      },
      {
        variant: 'soft',
        color: 'default',
        className: 'text-primary'
      },
      {
        variant: 'soft',
        color: 'secondary',
        className: 'text-card-foreground bg-opacity-40'
      }
    ],
    defaultVariants: {
      color: 'default'
    }
  }
)

// Define interface for remaining HTML attributes
interface AlertHTMLProps extends React.HTMLAttributes<HTMLDivElement> {
  dismissible?: boolean
  onDismiss?: () => void
}

// Merge both interfaces to create final AlertProps
type AlertProps = VariantProps<typeof alertVariants> & AlertHTMLProps

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, color, variant, dismissible, onDismiss, children, ...props }, ref) => {
    const [dismissed, setDismissed] = React.useState(false)

    const handleDismiss = () => {
      setDismissed(true)
      if (onDismiss) {
        onDismiss()
      }
    }

    return !dismissed ? (
      <div ref={ref} role='alert' className={cn(alertVariants({ color, variant }), className)} {...props}>
        {children}
        {dismissible && (
          <button onClick={handleDismiss} className='grow-0'>
            <X className='h-5 w-5' />
          </button>
        )}
      </div>
    ) : null
  }
)
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('col-start-2 mb-2 grow text-lg leading-none font-medium tracking-tight', className)}
      {...props}
    />
  )
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('col-start-2 grow text-sm [&_p]:leading-relaxed', className)} {...props} />
  )
)
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertDescription, AlertTitle }
