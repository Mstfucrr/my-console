'use client'

import { TooltippedElement } from '@/components/tooltipped-element'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogContentInner,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { formatCurrencyTRY } from '@/lib/utils/currency'
import { formatDateTimeTR } from '@/lib/utils/date'
import { PAYMENT_METHOD_TYPE_LABELS, type Order } from '@/types'
import { Printer } from 'lucide-react'
import { useEffect, useRef } from 'react'

const PRINT_CONTAINER_ID = 'order-receipt-print-container'

function getPaymentLabel(order: Order) {
  const key = order.paymentType as keyof typeof PAYMENT_METHOD_TYPE_LABELS
  return PAYMENT_METHOD_TYPE_LABELS[key] ?? order.paymentType ?? '-'
}

export function OrderReceiptPrint({ order, className }: { order: Order; className?: string }) {
  const printRef = useRef<HTMLDivElement | null>(null)

  const handlePrint = () => {
    const source = printRef.current
    if (!source) return

    const existing = document.getElementById(PRINT_CONTAINER_ID)
    existing?.remove()

    const container = document.createElement('div')
    container.id = PRINT_CONTAINER_ID
    container.appendChild(source.cloneNode(true))

    document.body.appendChild(container)
    document.body.dataset.receiptPrinting = 'true'

    const cleanup = () => {
      delete document.body.dataset.receiptPrinting
      container.remove()
    }

    window.addEventListener('afterprint', cleanup, { once: true })
    window.requestAnimationFrame(() => window.print())
    window.setTimeout(cleanup, 1000)
  }

  useEffect(() => {
    return () => {
      const container = document.getElementById(PRINT_CONTAINER_ID)
      container?.remove()
      delete document.body.dataset.receiptPrinting
    }
  }, [])

  return (
    <Dialog>
      <TooltippedElement tooltipContent='Yazdır' side='bottom' className='text-xs'>
        <DialogTrigger asChild>
          <Button type='button' color='primary' size='icon-sm' disabled={!order}>
            <Printer className='size-4' />
            <span className='sr-only'>Yazdır</span>
          </Button>
        </DialogTrigger>
      </TooltippedElement>

      <DialogContent size='sm' className='max-w-sm' onOpenAutoFocus={e => e.preventDefault()}>
        <DialogHeader>
          <div className='xs:mx-8 mr-8 ml-3 flex items-center justify-between sm:mx-6'>
            <DialogTitle>Detay</DialogTitle>
            <TooltippedElement tooltipContent='Yazdır' side='bottom' className='text-sm'>
              <Button type='button' color='primary' size='icon-sm' onClick={handlePrint} disabled={!order}>
                <Printer className='size-4' />
                <span className='sr-only'>Yazdır</span>
              </Button>
            </TooltippedElement>
          </div>
        </DialogHeader>

        <DialogContentInner className='relative -mt-2 mb-2 overflow-hidden p-0! sm:mb-4'>
          <div
            ref={printRef}
            data-receipt-root
            className={cn('receipt-root mx-auto overflow-hidden', className)}
            style={{ width: '80mm', maxWidth: '80mm' }}
          >
            <div className='receipt-paper rounded-lg border bg-white px-3 py-4'>
              <div className='grid grid-cols-[95px_1fr] gap-y-3 text-[12px] leading-5'>
                <div className='text-muted-foreground'>Sipariş saati</div>
                <div className='ph-sensitive font-medium'>{formatDateTimeTR(order.createdAt) || '-'}</div>

                <div className='text-muted-foreground'>Müşteri</div>
                <div className='ph-sensitive font-medium'>{order.customerName || '-'}</div>

                <div className='text-muted-foreground'>Telefon</div>
                <div className='ph-sensitive font-medium'>{order.customerPhone || '-'}</div>

                <div className='text-muted-foreground'>Adres</div>
                <div className='ph-sensitive font-medium'>{order.deliveryAddress || '-'}</div>

                <div className='text-muted-foreground'>Yol Tarifi</div>
                <div className='ph-sensitive font-medium'>{order.addressDirection || '-'}</div>

                <div className='text-muted-foreground'>Ödeme</div>
                <div className='ph-sensitive font-medium'>{getPaymentLabel(order)}</div>

                <div className='text-muted-foreground'>Sipariş Notu</div>
                <div className='ph-sensitive font-semibold italic'>{order.customerNote || '-'}</div>
              </div>

              <div className='-mx-3 mt-4 rounded-md bg-slate-50 px-3 py-2.5'>
                <div className='grid grid-cols-[95px_1fr] items-center text-[12px] font-bold'>
                  <span className='text-muted-foreground'>Toplam Tutar</span>
                  <span className='text-primary-700 ph-sensitive'>{formatCurrencyTRY(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContentInner>
      </DialogContent>

      <style jsx global>{`
        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
          }

          body[data-receipt-printing='true'] > :not(#${PRINT_CONTAINER_ID}) {
            visibility: hidden !important;
          }

          body[data-receipt-printing='true'] > #${PRINT_CONTAINER_ID} {
            visibility: visible !important;
            position: fixed;
            top: 0;
            left: 0;
            padding: 0;
            margin: 0;
            width: 80mm;
          }

          body[data-receipt-printing='true'] > #${PRINT_CONTAINER_ID} [data-receipt-root] {
            width: 80mm;
            max-width: 80mm;
            margin: 0;
            padding: 0;
            overflow: visible !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          body[data-receipt-printing='true'] > #${PRINT_CONTAINER_ID} .receipt-paper {
            border: none !important;
            border-radius: 0 !important;
            padding: 4mm !important;
          }

          body[data-receipt-printing='true']
            > #${PRINT_CONTAINER_ID},
            body[data-receipt-printing='true']
            > #${PRINT_CONTAINER_ID}
            * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          @page {
            margin: 0;
            size: 80mm auto;
          }
        }
      `}</style>
    </Dialog>
  )
}
