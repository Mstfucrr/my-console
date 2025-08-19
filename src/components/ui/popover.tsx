'use client'

import { cn } from '@/lib/utils'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import * as React from 'react'

/** Açık olan en üst Dialog/AlertDialog Content elemanını bulur */
function findTopMostOpenDialog(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  // Radix Dialog ve AlertDialog content nodları role=dialog/alertdialog ve data-state="open" taşır
  const dialogs = Array.from(
    document.querySelectorAll<HTMLElement>('[role="dialog"][data-state="open"],[role="alertdialog"][data-state="open"]')
  )
  if (dialogs.length === 0) return null
  // En son (DOM'da en aşağıda) olanı al: tipik olarak en üstteki modal
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
  /** Açılışta içerideki ilk input'a otomatik odaklan */
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
    // İlk render'da senkron bak: flicker olmadan doğru container'a portal'la
    const initialContainer = React.useMemo(
      () => (mountInsideDialog ? findTopMostOpenDialog() : null),
      [mountInsideDialog]
    )
    const [containerEl, setContainerEl] = React.useState<HTMLElement | null>(initialContainer)

    // Dialog açılıp kapanırsa veya bu komponent farklı bir anda mount olursa tekrar dene
    React.useEffect(() => {
      if (!mountInsideDialog) return
      // Eğer container bulunamadıysa (ör. SSR -> hydrate), mount sonrası tekrar ara
      if (!containerEl) {
        const found = findTopMostOpenDialog()
        if (found) setContainerEl(found)
      }
    }, [mountInsideDialog, containerEl])

    return (
      <PopoverPrimitive.Portal container={containerEl ?? undefined}>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          // Dialog içinde olduğumuzda z-index'i içerikle uyumlu tut (overlay genelde z-50 civarıdır)
          className={cn(
            'bg-popover text-popover-foreground',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            'z-[70] w-72 rounded-md border p-4 shadow-md outline-none', // z-[70]: DialogContent (z-50~60) üstünde kalır
            className
          )}
          // Açılışta input'a odaklan; üst form submit/blur tetiklemesin
          onOpenAutoFocus={e => {
            onOpenAutoFocus?.(e)
            if (!autoFocus) return
            try {
              // Radix kendi odak davranışını engelleyip sonra ilk input'a odaklan
              e.preventDefault()
              requestAnimationFrame(() => {
                const root = (e.currentTarget as HTMLElement) ?? document
                const input = root.querySelector<HTMLInputElement>('input, [contenteditable="true"]')
                input?.focus()
                // caret'i sona al
                if (input && input.setSelectionRange) {
                  const v = input.value ?? ''
                  input.setSelectionRange(v.length, v.length)
                }
              })
            } catch {
              /* yut */
            }
          }}
          // Popover içindeki tıklamaları "outside" sanıp kapatmayı önle
          onPointerDownOutside={evt => {
            // Eğer tıklanan target, Popover içindeki cmdk/combobox köküne yakınsa, kapatma
            const t = evt.target as HTMLElement
            if (t.closest('[cmdk-root]') || t.closest('[role="combobox"]')) {
              evt.preventDefault()
            }
            props.onPointerDownOutside?.(evt)
          }}
          {...props}
        />
      </PopoverPrimitive.Portal>
    )
  }
)
PopoverContent.displayName = PopoverPrimitive.Content.displayName

/** İhtiyaç duyarsan basit bir custom popover (portal kullanmadan) — değişmedi */
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
