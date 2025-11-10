import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/formatCurrency'
import { AlertTriangle, Check, Eye } from 'lucide-react'
import type { ReconciliationRecord } from '../types'

interface MainPageProps {
  record: ReconciliationRecord
  onViewInvoice: () => void
  onGoToApprovePage: () => void
  onGoToReportPage: () => void
}

export function MainPage({ record, onViewInvoice, onGoToApprovePage, onGoToReportPage }: MainPageProps) {
  const hasInvoice = record.invoiceUploaded
  const canReport = record.status === 'pending'
  const canApprove = record.status !== 'approved'
  return (
    <>
      <div className='flex-1 space-y-4 overflow-y-auto'>
        {/* Mutabakat Dönemi */}
        <div className='grid grid-cols-1 border-b pb-3 md:grid-cols-2'>
          <div className='flex flex-col gap-1 md:flex-row md:items-center md:justify-between'>
            <span className='text-sm text-gray-600'>Mutabakat Dönemi:</span>
            <span className='text-sm font-medium'>{record.period}</span>
          </div>
        </div>

        {/* Detay Bilgileri */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='space-y-3'>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>Toplam Sipariş Tutarı:</span>
              <span className='text-sm font-medium'>{formatCurrency(record.totalOrderAmount)}</span>
            </div>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>Dağıtım Adedi:</span>
              <span className='text-sm font-medium'>{record.distributionCount}</span>
            </div>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>Ata Express Dağıtım Fatura:</span>
              <span className='text-sm font-medium'>{formatCurrency(record.ataExpressDeliveryInvoice)}</span>
            </div>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>Düzenleyeceğiniz Fatura:</span>
              <span className='text-sm font-medium'>{formatCurrency(record.yourInvoiceAmount)}</span>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>Yemek Kartı (Tahsilatı Ata&apos;da):</span>
              <span className='text-sm font-medium'>{formatCurrency(record.mealCardAtaCollection)}</span>
            </div>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>Yemek Kartı (Tahsilatı Firmanızda):</span>
              <span className='text-sm font-medium'>{formatCurrency(record.mealCardCompanyCollection)}</span>
            </div>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>Online Ödeme Tutarı:</span>
              <span className='text-sm font-medium'>{formatCurrency(record.onlinePaymentAmount)}</span>
            </div>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>Restauranta Ödeme Tutarı:</span>
              <span className='text-sm font-medium'>{formatCurrency(record.restaurantPaymentAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className='-mx-6 -mb-6 border-t bg-gray-50 px-6 py-4 pt-4'>
        <div className='flex w-full flex-wrap gap-3'>
          {hasInvoice && (
            <Button onClick={onViewInvoice} variant='outline' className='flex items-center gap-2'>
              <Eye className='h-4 w-4' />
              Fatura/Cari Görüntüle
            </Button>
          )}

          {canApprove && (
            <Button onClick={onGoToApprovePage} color='success' className='flex items-center gap-2'>
              <Check className='h-4 w-4' />
              Onayla
            </Button>
          )}

          {canReport && (
            <Button onClick={onGoToReportPage} color='destructive' className='flex items-center gap-2'>
              <AlertTriangle className='h-4 w-4' />
              Kontrole Gönder
            </Button>
          )}
        </div>
      </DialogFooter>
    </>
  )
}
