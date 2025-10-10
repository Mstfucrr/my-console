import * as SheetPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = ({ ...props }) => <SheetPrimitive.Portal {...props} />
SheetPortal.displayName = SheetPrimitive.Portal.displayName

const SheetOverlay = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>) => (
  <SheetPrimitive.Overlay
    className={cn(
      'bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-999 backdrop-blur-sm',
      className
    )}
    {...props}
  />
)
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  'bg-card data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-999 gap-4 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b',
        bottom:
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t',
        left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 max-w-sm border-r',
        right:
          'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 max-w-sm border-l'
      }
    },
    defaultVariants: {
      side: 'right'
    }
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  overlayClass?: string
  onClose?: () => void
  closeIcon?: React.ReactNode
}
const SheetContent = ({
  side = 'right',
  className,
  children,
  onClose,
  overlayClass,
  closeIcon = <X className='h-4 w-4' />,
  ...props
}: SheetContentProps) => (
  <SheetPortal>
    <SheetOverlay className={cn(overlayClass)} />
    <SheetPrimitive.Content className={cn(sheetVariants({ side }), className)} {...props}>
      {children}
      {onClose ? (
        <button
          onClick={onClose}
          type='button'
          className='ring-offset-background data-[state=open]:bg-secondary absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none'
        >
          {closeIcon}
        </button>
      ) : (
        <SheetPrimitive.Close className='ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none'>
          {closeIcon}
          <span className='sr-only'>Close</span>
        </SheetPrimitive.Close>
      )}
    </SheetPrimitive.Content>
  </SheetPortal>
)
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
)
SheetHeader.displayName = 'SheetHeader'

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
)
SheetFooter.displayName = 'SheetFooter'

const SheetTitle = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>) => (
  <SheetPrimitive.Title className={cn('text-foreground text-lg font-semibold', className)} {...props} />
)
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>) => (
  <SheetPrimitive.Description className={cn('text-muted-foreground text-sm', className)} {...props} />
)
SheetDescription.displayName = SheetPrimitive.Description.displayName

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger }
