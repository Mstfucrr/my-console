'use client'

import { cn } from '@/lib/utils'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import * as React from 'react'

/** Açık olan en üst Dialog/AlertDialog Content elemanını bulur */
function findTopMostOpenDialog(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  const dialogs = Array.from(
    document.querySelectorAll<HTMLElement>('[role="dialog"][data-state="open"],[role="alertdialog"][data-state="open"]')
  )
  if (dialogs.length === 0) return null
  return dialogs[dialogs.length - 1]
}

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverClose = PopoverPrimitive.Close
const PopoverArrow = PopoverPrimitive.Arrow

type PopoverContentBaseProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
type PopoverContentProps = PopoverContentBaseProps & {
  /** true: varsa otomatik olarak açık Dialog içine portal'la (default: true) */
  mountInsideDialog?: boolean
  /** Açılışta içerideki ilk input'a otomatik odaklan (default: true) */
  autoFocus?: boolean
}

const PopoverContent = React.forwardRef<React.ElementRef<typeof PopoverPrimitive.Content>, PopoverContentProps>(
  (
    {
      className,
      align = 'center',
      sideOffset = 4,
      mountInsideDialog = true,
      autoFocus = true,
      onOpenAutoFocus,
      ...props
    },
    ref
  ) => {
    // İlk render'da container'ı belirle
    const initialContainer = React.useMemo(
      () => (mountInsideDialog ? findTopMostOpenDialog() : null),
      [mountInsideDialog]
    )
    const [containerEl, setContainerEl] = React.useState<HTMLElement | null>(initialContainer)

    // Mount/yeniden açılmalarda container'ı güncelle
    React.useEffect(() => {
      if (!mountInsideDialog) return
      setContainerEl(findTopMostOpenDialog())
    }, [mountInsideDialog])

    return (
      <PopoverPrimitive.Portal container={containerEl ?? undefined}>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            'bg-popover text-popover-foreground',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            // DialogOverlay genelde z-50; Content ~z-60. Bunu bir tık üste alıyoruz.
            'z-70 w-72 rounded-md border p-4 shadow-md outline-none',
            className
          )}
          onOpenAutoFocus={e => {
            onOpenAutoFocus?.(e)
            if (!autoFocus) return
            try {
              // Radix'in default focusunu engelleyip ilk input'a fokus
              e.preventDefault()
              requestAnimationFrame(() => {
                const root = e.currentTarget as HTMLElement
                if (!root) return
                const input = root.querySelector<HTMLInputElement>('input, [contenteditable="true"]')
                input?.focus()
                if (input?.setSelectionRange) {
                  const v = input.value ?? ''
                  input.setSelectionRange(v.length, v.length)
                }
              })
            } catch {
              /* noop */
            }
          }}
          // Not: onPointerDownOutside / onInteractOutside EKLEMEDİK.
          // Böylece outside click default olarak popover'ı kapatır.
          {...props}
        />
      </PopoverPrimitive.Portal>
    )
  }
)
PopoverContent.displayName = PopoverPrimitive.Content.displayName

/** Basit custom popover (portal kullanmadan) — opsiyonel util */
interface CustomPopoverProps {
  children: React.ReactNode
  open?: boolean
  onClose: () => void
  className?: string
  trigger?: React.ReactNode
}

const CustomPopover: React.FC<CustomPopoverProps> = ({ children, open = false, onClose, className, trigger }) => {
  const popoverRef = React.useRef<HTMLDivElement>(null)

  const handleClickOutside = React.useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        !(target as Element).closest?.('.custom-popover-container')
      ) {
        onClose()
      }
    },
    [onClose]
  )

  React.useEffect(() => {
    document?.addEventListener('click', handleClickOutside)
    return () => {
      document?.removeEventListener('click', handleClickOutside)
    }
  }, [handleClickOutside])

  return (
    <div className='relative' ref={popoverRef}>
      {trigger}
      {open && (
        <div
          className={cn(
            'custom-popover-container divide-default-100 border-default-200 bg-popover absolute left-0 z-[70] w-56 divide-y rounded-md border shadow-lg focus:outline-none',
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}
CustomPopover.displayName = 'CustomPopover'

export { CustomPopover, Popover, PopoverArrow, PopoverClose, PopoverContent, PopoverTrigger }
