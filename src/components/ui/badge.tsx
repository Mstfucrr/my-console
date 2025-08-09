import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-[2px] text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none',
  {
    variants: {
      color: {
        default: 'bg-primary text-primary-foreground border-transparent',
        destructive: 'bg-destructive text-destructive-foreground border-transparent',
        success: 'bg-success text-success-foreground border-transparent',
        info: 'bg-info text-info-foreground border-transparent',
        warning: 'bg-warning text-warning-foreground border-transparent',
        secondary: 'bg-secondary text-foreground border-transparent',
        dark: 'bg-accent-foreground text-accent border-transparent'
      },
      variant: {
        outline: 'bg-background border border-current',
        soft: 'bg-opacity-10 hover:text-primary-foreground text-current'
      }
    },
    compoundVariants: [
      {
        variant: 'outline',
        color: 'destructive',
        className: 'text-destructive'
      },
      {
        variant: 'outline',
        color: 'success',
        className: 'text-success'
      },
      {
        variant: 'outline',
        color: 'info',
        className: 'text-info'
      },
      {
        variant: 'outline',
        color: 'warning',
        className: 'text-warning'
      },
      {
        variant: 'outline',
        color: 'dark',
        className: 'text-accent-foreground'
      },
      {
        variant: 'outline',
        color: 'secondary',
        className: 'text-muted-foreground border-default-500 dark:bg-transparent'
      },
      {
        variant: 'outline',
        color: 'default',
        className: 'text-primary'
      },
      // soft button variant
      {
        variant: 'soft',
        color: 'default',
        className: 'text-primary hover:text-primary'
      },
      {
        variant: 'soft',
        color: 'info',
        className: 'text-info hover:text-info'
      },
      {
        variant: 'soft',
        color: 'warning',
        className: 'text-warning hover:text-warning'
      },
      {
        variant: 'soft',
        color: 'destructive',
        className: 'text-destructive hover:text-destructive'
      },
      {
        variant: 'soft',
        color: 'success',
        className: 'text-success hover:text-success'
      },
      {
        variant: 'soft',
        color: 'secondary',
        className: 'text-muted-foreground hover:text-muted-foreground !bg-opacity-50'
      },
      {
        variant: 'soft',
        color: 'default',
        className: 'text-primary hover:text-primary'
      }
    ],
    defaultVariants: {
      color: 'default'
    }
  }
)
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  variant?: 'outline' | 'soft'
  color?: 'default' | 'destructive' | 'success' | 'info' | 'warning' | 'dark' | 'secondary'
}

function Badge({ className, color, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ color, variant }), className)} {...props} />
}

export { Badge, badgeVariants }
