'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()

  // Upload File Mutation
  const { mutateAsync: uploadFile, isPending: isUploading } = useMutation({
    mutationFn: (file: File) => reconciliationService.uploadFile(file),
    mutationKey: ['uploadFile']
  })

  // Approve Reconciliation Mutation
  const { mutateAsync: approveReconciliation, isPending: isApproving } = useMutation({
    mutationFn: ({
      recordId,
      confirmRecordId,
      fileName
    }: {
      recordId: string
      confirmRecordId: string | undefined
      fileName?: string
    }) => reconciliationService.approveReconciliation(recordId, confirmRecordId, fileName),
    mutationKey: ['approveReconciliation'],
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['reconciliation'] })
      queryClient.invalidateQueries({ queryKey: ['reconciliation-stats'] })
    }
  })

  // Report Issue Mutation
  const { mutateAsync: reportIssue, isPending: isReporting } = useMutation({
    mutationFn: ({
      recordId,
      confirmRecordId,
      description,
      fileName
    }: {
      recordId: string
      confirmRecordId: string | undefined
      description: string
      fileName?: string
    }) => reconciliationService.reportIssue(recordId, confirmRecordId, description, fileName),
    mutationKey: ['reportIssue'],
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['reconciliation'] })
      queryClient.invalidateQueries({ queryKey: ['reconciliation-stats'] })
    }
  })

  const handleInvoiceFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !record) return

    toast.promise(
      async () => {
        await uploadFile(file)
        // After upload, update the confirmation with the file name
        await approveReconciliation({
          recordId: record.RecordID,
          confirmRecordId: record.ConfirmID,
          fileName: file.name
        })
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
    if (!record || !record.ConfirmID) return

    // TODO: Get invoice URL from backend or S3
    const invoiceUrl = `/invoices/${record.RecordID}.pdf`
    window.open(invoiceUrl, '_blank')
  }

  const handleApprove = async (data: { invoiceFile: File }) => {
    if (!record) return

    try {
      await toast.promise(
        async () => {
          // First upload the file to S3
          await uploadFile(data.invoiceFile)
          // Then approve with the file name
          await approveReconciliation({
            recordId: record.RecordID,
            confirmRecordId: record.ConfirmID,
            fileName: data.invoiceFile.name
          })
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
          // First upload the statement file to S3
          await uploadFile(data.statementFile)
          // Then report issue with description and file name
          await reportIssue({
            recordId: record.RecordID,
            confirmRecordId: record.ConfirmID,
            description: data.description,
            fileName: data.statementFile.name
          })
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
