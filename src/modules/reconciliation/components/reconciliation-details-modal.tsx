'use client'

import { Button } from '@/components/ui/button'
import { ConfirmButton } from '@/components/ui/confirm-button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/formatCurrency'
import { useMutation } from '@tanstack/react-query'
import { AlertTriangle, Check, Eye, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { reconciliationService } from '../service'
import type { ReconciliationRecord } from '../types'

interface ReconciliationDetailsModalProps {
  record: ReconciliationRecord
  isOpen: boolean
  onClose: () => void
}

interface IssueReportPopoverProps {
  onReport: (description: string) => void
  isReporting: boolean
}

// TODO: Cari ekstre dosyası da eklenecek
function IssueReportPopover({ onReport, isReporting }: IssueReportPopoverProps) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState('')

  const handleReport = () => {
    if (!description.trim()) return

    onReport(description)
    setDescription('')
    setOpen(false)
  }

  const handleCancel = () => {
    setDescription('')
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button color='destructive' className='flex items-center gap-2' disabled={isReporting}>
          <AlertTriangle className='h-4 w-4' />
          {isReporting ? 'Gönderiliyor...' : 'Kontrole Gönder'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 p-4' mountInsideDialog={false} side='top' align='center'>
        <div className='space-y-4'>
          <div className='text-center text-sm font-medium'>Neden mutabık olmadığınızı aşağıdaki alanda belirtiniz</div>
          <Textarea
            placeholder='Açıklamanızı giriniz...'
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className='resize-none'
          />
          <div className='flex justify-center space-x-2'>
            <Button variant='outline' size='xs' onClick={handleCancel}>
              İptal
            </Button>
            <Button color='destructive' size='xs' onClick={handleReport} disabled={!description.trim() || isReporting}>
              {isReporting ? 'Gönderiliyor...' : 'Gönder'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function ReconciliationDetailsModal({ record, isOpen, onClose }: ReconciliationDetailsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canApprove = record.status !== 'approved'
  const hasInvoice = record.invoiceUploaded

  // Upload Invoice Mutation
  const { mutateAsync: uploadInvoice, isPending: isUploading } = useMutation({
    mutationFn: ({ recordId, file }: { recordId: string; file: File }) =>
      reconciliationService.uploadInvoice(recordId, file),
    mutationKey: ['uploadInvoice']
  })

  // Approve Reconciliation Mutation
  const { mutateAsync: approveReconciliation, isPending: isApproving } = useMutation({
    mutationFn: reconciliationService.approveReconciliation,
    mutationKey: ['approveReconciliation']
  })

  // Report Issue Mutation
  const { mutateAsync: reportIssue, isPending: isReporting } = useMutation({
    mutationFn: ({ recordId, description }: { recordId: string; description: string }) =>
      reconciliationService.reportIssue(recordId, description),
    mutationKey: ['reportIssue']
  })

  const handleUploadInvoice = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !record) return

    toast.promise(
      async () => {
        await uploadInvoice({ recordId: record.id, file })
        onClose()
      },
      {
        pending: 'Fatura yükleniyor...',
        success: 'Fatura başarıyla yüklendi',
        error: 'Fatura yüklenirken bir hata oluştu'
      }
    )
  }

  const handleViewInvoice = () => {
    if (!record) return

    const invoiceUrl = `/invoices/${record.id}.pdf`
    window.open(invoiceUrl, '_blank')
  }

  const handleApprove = () => {
    if (!record) return

    toast.promise(
      async () => {
        await approveReconciliation(record.id)
        onClose()
      },
      {
        pending: 'Mutabakat onaylanıyor...',
        success: 'Mutabakat başarıyla onaylandı',
        error: 'Mutabakat onaylanırken bir hata oluştu'
      }
    )
  }

  const handleReportIssue = (description: string) => {
    toast.promise(
      async () => {
        await reportIssue({ recordId: record.id, description })
        onClose()
      },
      {
        pending: 'Sorun bildiriliyor...',
        success: 'Sorun başarıyla bildirildi',
        error: 'Sorun bildirilirken bir hata oluştu'
      }
    )
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type='file'
        accept='.pdf,.jpg,.jpeg,.png'
        onChange={handleFileChange}
        className='hidden'
      />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent size='3xl' className='max-h-[90vh] overflow-hidden'>
          <DialogHeader className='pb-4'>
            <DialogTitle className='text-xl font-semibold'>Mutabakat Detayları</DialogTitle>
          </DialogHeader>

          <div className='flex-1 space-y-4 overflow-y-auto'>
            {/* Mutabakat Dönemi - Üstte tek satır */}
            <div className='grid grid-cols-2 border-b pb-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Mutabakat Dönemi:</span>
                <span className='text-sm font-medium'>{record.period}</span>
              </div>
            </div>

            {/* Detay Bilgileri - 2 sütunlu grid */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-3'>
                <div className='flex items-center justify-between border-b pb-2'>
                  <span className='text-sm text-gray-600'>Toplam Sipariş Tutarı:</span>
                  <span className='text-sm font-medium'>{formatCurrency(record.totalOrderAmount)}</span>
                </div>
                <div className='flex items-center justify-between border-b pb-2'>
                  <span className='text-sm text-gray-600'>Dağıtım Adedi:</span>
                  <span className='text-sm font-medium'>{record.distributionCount}</span>
                </div>
                <div className='flex items-center justify-between border-b pb-2'>
                  <span className='text-sm text-gray-600'>Ata Express Dağıtım Fatura:</span>
                  <span className='text-sm font-medium'>{formatCurrency(record.ataExpressDeliveryInvoice)}</span>
                </div>
                <div className='flex items-center justify-between border-b pb-2'>
                  <span className='text-sm text-gray-600'>Düzenleyeceğiniz Fatura:</span>
                  <span className='text-sm font-medium'>{formatCurrency(record.yourInvoiceAmount)}</span>
                </div>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center justify-between border-b pb-2'>
                  <span className='text-sm text-gray-600'>Yemek Kartı (Tahsilatı Ata&apos;da):</span>
                  <span className='text-sm font-medium'>{formatCurrency(record.mealCardAtaCollection)}</span>
                </div>
                <div className='flex items-center justify-between border-b pb-2'>
                  <span className='text-sm text-gray-600'>Yemek Kartı (Tahsilatı Firmanızda):</span>
                  <span className='text-sm font-medium'>{formatCurrency(record.mealCardCompanyCollection)}</span>
                </div>
                <div className='flex items-center justify-between border-b pb-2'>
                  <span className='text-sm text-gray-600'>Online Ödeme Tutarı:</span>
                  <span className='text-sm font-medium'>{formatCurrency(record.onlinePaymentAmount)}</span>
                </div>
                <div className='flex items-center justify-between border-b pb-2'>
                  <span className='text-sm text-gray-600'>Restauranta Ödeme Tutarı:</span>
                  <span className='text-sm font-medium'>{formatCurrency(record.restaurantPaymentAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className='-mx-6 -mb-6 border-t bg-gray-50 px-6 py-4 pt-4'>
            <div className='flex w-full flex-wrap gap-3'>
              {!hasInvoice && (
                <Button
                  onClick={handleUploadInvoice}
                  color='warning'
                  className='flex items-center gap-2'
                  disabled={isUploading}
                >
                  <Upload className='h-4 w-4' />
                  {isUploading ? 'Yükleniyor...' : 'Fatura Yükle'}
                </Button>
              )}

              {hasInvoice && (
                <Button onClick={handleViewInvoice} variant='outline' className='flex items-center gap-2'>
                  <Eye className='h-4 w-4' />
                  Fatura/Cari Görüntüle
                </Button>
              )}

              {canApprove && (
                // TODO: Fatura yükleme olacak zorunlu olacak.
                <ConfirmButton
                  onConfirm={handleApprove}
                  color='success'
                  className='flex items-center gap-2'
                  disabled={isApproving}
                  confirmationMessage='Mutabıkız onay bildirimi yapıyorsunuz, '
                  confirmButtonMessage='Evet, Onayla'
                  cancelButtonMessage='İptal'
                >
                  <Check className='h-4 w-4' />
                  {isApproving ? 'Onaylanıyor...' : 'Onayla'}
                </ConfirmButton>
              )}

              <IssueReportPopover onReport={handleReportIssue} isReporting={isReporting} />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
