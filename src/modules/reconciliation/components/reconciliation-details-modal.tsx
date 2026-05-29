'use client'

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { DialogContentInner } from '@/components/ui/dialog'
import { track } from '@/lib/analytics'
import { ANALYTICS_EVENTS } from '@/lib/analytics/events'
import { ReconciliationActionEvent } from '@/lib/analytics/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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

  const handleClose = () => {
    onClose()
  }

  const handleApprove = async (data: { invoiceFile: File }) => {
    if (!record) return

    track<ReconciliationActionEvent>(ANALYTICS_EVENTS.reconciliationAction, {
      action: 'approve',
      status: 'attempt',
      period: record.period,
      record_status: record.status
    })

    try {
      await toast.promise(
        async () => {
          // First upload the file to S3
          const uploadData = await uploadFile(data.invoiceFile)
          if (!uploadData) throw new Error('Fatura yüklenemedi')
          // Then approve with the file name
          await approveReconciliation({
            recordId: record.RecordID,
            confirmRecordId: record.ConfirmID,
            fileName: uploadData.url
          })
        },
        {
          pending: 'Fatura yükleniyor ve mutabakat onaylanıyor...',
          success: 'Fatura yüklendi ve mutabakat başarıyla onaylandı',
          error: 'İşlem sırasında bir hata oluştu'
        }
      )
      track<ReconciliationActionEvent>(ANALYTICS_EVENTS.reconciliationAction, {
        action: 'approve',
        status: 'success',
        period: record.period,
        record_status: record.status
      })
      handleClose()
    } catch {
      track<ReconciliationActionEvent>(ANALYTICS_EVENTS.reconciliationAction, {
        action: 'approve',
        status: 'failed',
        period: record.period,
        record_status: record.status
      })
    }
  }

  const handleReportIssue = async (data: { description: string; statementFile: File }) => {
    if (!record) return

    try {
      track<ReconciliationActionEvent>(ANALYTICS_EVENTS.reconciliationAction, {
        action: 'report',
        status: 'attempt',
        period: record.period,
        record_status: record.status
      })
      await toast.promise(
        async () => {
          // First upload the statement file to S3
          const uploadData = await uploadFile(data.statementFile)
          if (!uploadData) throw new Error('Fatura yüklenemedi')
          // Then report issue with description and file name
          await reportIssue({
            recordId: record.RecordID,
            confirmRecordId: record.ConfirmID,
            description: data.description,
            fileName: uploadData.url
          })
        },
        {
          pending: 'Mutabık olmadığınızın bildirimi yapılıyor...',
          success: 'Mutabık olmadığınızın bildirimi başarıyla yapıldı',
          error: 'Mutabık olmadığınızın bildirimi yapılırken bir hata oluştu'
        }
      )
      track<ReconciliationActionEvent>(ANALYTICS_EVENTS.reconciliationAction, {
        action: 'report',
        status: 'success',
        period: record.period,
        record_status: record.status
      })
      handleClose()
    } catch {
      // Error is handled by toast
      track<ReconciliationActionEvent>(ANALYTICS_EVENTS.reconciliationAction, {
        action: 'report',
        status: 'failed',
        period: record.period,
        record_status: record.status
      })
    }
  }

  return (
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
  )
}
