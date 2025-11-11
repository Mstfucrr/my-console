'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { reconciliationService } from '../service'
import type { ReconciliationRecord } from '../types'
import { ApprovePage } from './approve-page'
import { MainPage } from './main-page'
import { ReportPage } from './report-page'

type ModalPage = 'main' | 'approve' | 'report'

const PAGE_TITLES: Record<ModalPage, string> = {
  main: 'Mutabakat Detayları',
  approve: 'Mutabakat Onayı',
  report: 'Kontrole Gönder'
}

interface ReconciliationDetailsModalProps {
  record: ReconciliationRecord
  isOpen: boolean
  onClose: () => void
}

export function ReconciliationDetailsModal({ record, isOpen, onClose }: ReconciliationDetailsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentPage, setCurrentPage] = useState<ModalPage>('main')

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
    mutationFn: ({
      recordId,
      description,
      statementFile
    }: {
      recordId: string
      description: string
      statementFile?: File
    }) => reconciliationService.reportIssue(recordId, description, statementFile),
    mutationKey: ['reportIssue']
  })

  const handleInvoiceFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const resetPageState = () => {
    setCurrentPage('main')
  }

  const handleClose = () => {
    resetPageState()
    onClose()
  }

  const handleViewInvoice = () => {
    if (!record) return

    const invoiceUrl = `/invoices/${record.id}.pdf`
    window.open(invoiceUrl, '_blank')
  }

  const handleApprove = async (data: { invoiceFile: File }) => {
    if (!record) return

    try {
      await toast.promise(
        async () => {
          await uploadInvoice({ recordId: record.id, file: data.invoiceFile })
          await approveReconciliation(record.id)
        },
        {
          pending: 'Fatura yükleniyor ve mutabakat onaylanıyor...',
          success: 'Fatura yüklendi ve mutabakat başarıyla onaylandı',
          error: 'İşlem sırasında bir hata oluştu'
        }
      )
      handleClose()
    } catch {
      // Error is handled by toast
    }
  }

  const handleReportIssue = async (data: { description: string; statementFile: File }) => {
    if (!record) return

    try {
      await toast.promise(
        async () => {
          await reportIssue({ recordId: record.id, description: data.description, statementFile: data.statementFile })
        },
        {
          pending: 'Mutabık olmadığınızın bildirimi yapılıyor...',
          success: 'Mutabık olmadığınızın bildirimi başarıyla yapıldı',
          error: 'Mutabık olmadığınızın bildirimi yapılırken bir hata oluştu'
        }
      )
      handleClose()
    } catch {
      // Error is handled by toast
    }
  }

  const handleGoToApprovePage = () => {
    setCurrentPage('approve')
  }

  const handleGoToReportPage = () => {
    setCurrentPage('report')
  }

  const handleBackToMain = () => {
    resetPageState()
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type='file'
        accept='.pdf,.jpg,.jpeg,.png'
        onChange={handleInvoiceFileChange}
        className='hidden'
      />
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent size={currentPage === 'main' ? '3xl' : 'lg'} className='max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='text-xl font-semibold'>{PAGE_TITLES[currentPage]}</DialogTitle>
          </DialogHeader>

          {currentPage === 'main' && (
            <MainPage
              record={record}
              onViewInvoice={handleViewInvoice}
              onGoToApprovePage={handleGoToApprovePage}
              onGoToReportPage={handleGoToReportPage}
            />
          )}
          {currentPage === 'approve' && (
            <ApprovePage onBack={handleBackToMain} onSubmit={handleApprove} isSubmitting={isApproving || isUploading} />
          )}
          {currentPage === 'report' && (
            <ReportPage onBack={handleBackToMain} onSubmit={handleReportIssue} isSubmitting={isReporting} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
