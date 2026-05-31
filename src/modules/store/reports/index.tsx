'use client'

import PageError from '@/components/page-error'
import { getOperationDateRange } from '@/constants'
import { PaginationOptions } from '@/types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import type { ColumnSort } from '@tanstack/react-table'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { type ReportsFilterProperties } from './components/reports-filters'
import ReportsTable from './components/reports-table'
import { reportsService } from './service/reports.service'
import { SendEmailResponse } from './types'

export const defaultReportsFilters: ReportsFilterProperties = {
  search: '',
  status: 'all',
  paymentMethod: 'all',
  dateRange: {
    from: new Date(getOperationDateRange().startDate),
    to: new Date(getOperationDateRange().endDate)
  }
}

const defaultSort: ColumnSort = { id: 'CreatedOn', desc: true }

export default function ReportsView() {
  const [filters, setFilters] = useState<ReportsFilterProperties>(defaultReportsFilters)

  const [reportsPagination, setReportsPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 20
  })
  const [sorting, setSorting] = useState<ColumnSort>(defaultSort)

  const handleReportsPageSizeChange = (size: number) => {
    setReportsPagination({ page: 1, limit: size })
  }

  const handleReportsPageChange = (page: number) => {
    setReportsPagination({ ...reportsPagination, page })
  }

  const {
    data: reportsData,
    isLoading: isReportsLoading,
    isFetching: isReportsFetching,
    error: error,
    refetch: refetchReports
  } = useQuery({
    queryKey: ['reports', filters, reportsPagination, sorting],
    queryFn: () => reportsService.getReports(filters, reportsPagination, sorting),
    staleTime: 3 * 60 * 1000, // 2 dakika
    placeholderData: keepPreviousData
  })

  const { mutateAsync: sendEmail, isPending: isSending } = useMutation({
    mutationFn: ({ filters, sorting }: { filters: ReportsFilterProperties; sorting?: ColumnSort }) =>
      reportsService.sendEmail(filters, sorting),
    mutationKey: ['send-email']
  })

  const handleSendEmail = async () => {
    await toast.promise(async () => await sendEmail({ filters, sorting }), {
      pending: 'Raporlar e-posta olarak gönderiliyor...',
      success: { render: ({ data }: { data: SendEmailResponse }) => data.message },
      error: {
        render: ({ data }: { data: AxiosError<{ message?: string }> }) =>
          data?.response?.data?.message ?? 'Raporlar e-posta olarak gönderilirken bir hata oluştu'
      }
    })
  }

  const handleFiltersChange = (newFilters: ReportsFilterProperties) => {
    setFilters(newFilters)
  }

  const handleRefresh = () => {
    setReportsPagination({ ...reportsPagination, page: 1 })
    setFilters(defaultReportsFilters)
    refetchReports()
  }

  const handleClearFilters = () => {
    setFilters(defaultReportsFilters)
  }

  if (error)
    return (
      <PageError
        errorMessage='Rapor verileri yüklenirken bir hata oluştu'
        onRefresh={handleRefresh}
        isLoading={isReportsFetching}
        title='Rapor Verileri Yüklenemedi'
        description='Rapor verileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      />
    )

  return (
    <div className='flex flex-col gap-4 pb-6 max-sm:p-0'>
      <ReportsTable
        data={reportsData?.data || []}
        isLoading={isReportsLoading || isReportsFetching}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        onRefresh={refetchReports}
        sorting={sorting}
        onSortingChange={setSorting}
        onPageChange={handleReportsPageChange}
        page={reportsPagination.page}
        pageSize={reportsPagination.limit}
        total={reportsData?.total}
        onPageSizeChange={handleReportsPageSizeChange}
        enableMultiSort={false}
        manualSorting
        handleSendEmail={handleSendEmail}
        isSending={isSending}
      />
    </div>
  )
}
