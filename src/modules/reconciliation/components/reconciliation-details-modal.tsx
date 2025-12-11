'use client'

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { DialogContentInner } from '@/components/ui/dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { toast } from 'react-toastify'
import { reconciliationService } from '../service/reconciliation.service'
import type { ReconciliationRecord } from '../types'
import { ApprovePage } from './approve-page'
import { ReportPage } from './report-page'

type ModalPage = 'approve' | 'report'

const PAGE_TITLES: Record<ModalPage, string> = {
  approve: 'Mutabakat Onayı',
  report: 'Kontrole Gönder'
}

interface ReconciliationDetailsModalProps {
  page: ModalPage
  record: ReconciliationRecord
  isOpen: boolean
  onClose: () => void
}

export function ReconciliationDetailsModal({ page, record, isOpen, onClose }: ReconciliationDetailsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const handleClose = () => {
    onClose()
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

  return (
    <>
      <input
        ref={fileInputRef}
        type='file'
        accept='.pdf,.jpg,.jpeg,.png'
        onChange={handleInvoiceFileChange}
        className='hidden'
      />
      <AlertDialog open={isOpen} onOpenChange={handleClose}>
        <AlertDialogContent size='lg' className='p-2 sm:p-4'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-xl font-semibold'>{PAGE_TITLES[page]}</AlertDialogTitle>
          </AlertDialogHeader>

          <DialogContentInner>
            {page === 'approve' && <ApprovePage onSubmit={handleApprove} isSubmitting={isApproving || isUploading} />}
            {page === 'report' && <ReportPage onSubmit={handleReportIssue} isSubmitting={isReporting} />}
          </DialogContentInner>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
