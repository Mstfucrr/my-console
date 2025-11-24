import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { MONTHS } from '@/constants'
import { formatCurrency } from '@/lib/formatCurrency'
import { AlertTriangle, Check, Eye } from 'lucide-react'
import type { ReconciliationRecord } from '../types'
import { ReconciliationConfirmStatus } from '../types'

interface MainPageProps {
  record: ReconciliationRecord
  onViewInvoice: () => void
  onGoToApprovePage: () => void
  onGoToReportPage: () => void
}

// Helper function to format period
const formatPeriod = (record: ReconciliationRecord): string => {
  if (record.RecordPeriodName) {
    return record.RecordPeriodName
  }

  return `${record.RecordPeriod}. Dönem - ${MONTHS[record.RecordMonth - 1]} ${record.RecordYear}`
}

export function MainPage({ record, onViewInvoice, onGoToApprovePage, onGoToReportPage }: MainPageProps) {
  // Check if invoice is uploaded (if ConfirmID exists and has a file name)
  const hasInvoice = !!record.ConfirmID && record.ConfirmID !== '0' && !!record.ConfirmNote
  // Can report if status is PENDING
  const canReport = record.ConfirmStatus === ReconciliationConfirmStatus.PENDING
  // Can approve if status is not APPROVED
  const canApprove = record.ConfirmStatus !== ReconciliationConfirmStatus.APPROVED

  return (
    <>
      <div className='flex-1 space-y-4'>
        {/* Mutabakat Dönemi */}
        <div className='grid grid-cols-1 border-b pb-3 md:grid-cols-2'>
          <div className='flex flex-col gap-1 md:flex-row md:items-center md:justify-between'>
            <span className='text-sm text-gray-600'>Mutabakat Dönemi:</span>
            <span className='text-sm font-medium'>{formatPeriod(record)}</span>
          </div>
        </div>

        {/* Detay Bilgileri */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='space-y-3'>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>Toplam Sipariş Tutarı:</span>
              <span className='text-sm font-medium'>{formatCurrency(record.TotalAmount)}</span>
            </div>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>Dağıtım Adedi:</span>
              <span className='text-sm font-medium'>{record.OrderCount}</span>
            </div>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>Toplam Ön Ödemeli Tutar:</span>
              <span className='text-sm font-medium'>{formatCurrency(record.TotalPrePaidAmount)}</span>
            </div>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>Toplam Teslimat Tutarı:</span>
              <span className='text-sm font-medium'>{formatCurrency(record.TotalDeliveryAmount)}</span>
            </div>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>Restoran Ödeme Tutarı:</span>
              <span className='text-sm font-medium'>{formatCurrency(record.RestaurantPaymentAmount)}</span>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>Yemek Kartı Tutarı:</span>
              <span className='text-sm font-medium'>{formatCurrency(record.TotalFoodCouponAmount)}</span>
            </div>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>Ön Ödemeli Yemek Kartı Tutarı:</span>
              <span className='text-sm font-medium'>{formatCurrency(record.TotalPrePaidFoodCouponAmount)}</span>
            </div>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>İptal Adedi:</span>
              <span className='text-sm font-medium'>{record.CancelCount}</span>
            </div>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>İptal Tutarı:</span>
              <span className='text-sm font-medium'>{formatCurrency(record.TotalCancelAmount)}</span>
            </div>
            <div className='flex flex-col gap-1 border-b pb-2 md:flex-row md:items-center md:justify-between'>
              <span className='text-sm text-gray-600'>Toplam Ciro:</span>
              <span className='text-sm font-medium'>{formatCurrency(record.TotalTurnover)}</span>
            </div>
          </div>
        </div>
      </div>

      {(hasInvoice || canApprove || canReport) && (
        <DialogFooter>
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
      )}
    </>
  )
}
