'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { BasicDataTable } from '@/components/ui/basic-data-table'
import { Button } from '@/components/ui/button'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { APILog, PaginatedResponse } from '@/modules/types'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { AlertCircle, Bug, CheckCircle2, Search, X, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { settingsService } from '../service'

type Props = {
  open: boolean
  onClose: () => void
}

export default function ApiLogsModal({ open, onClose }: Props) {
  const [filters, setFilters] = useState<{ success?: 'all' | 'true' | 'false'; endpoint?: string }>({
    success: 'all'
  })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [selectedLog, setSelectedLog] = useState<APILog | null>(null)
  const [detailTab, setDetailTab] = useState<'genel' | 'request' | 'response'>('genel')

  const {
    data: logsResponse,
    isLoading,
    isFetching,
    refetch
  } = useQuery<PaginatedResponse<APILog>>({
    queryKey: ['api-logs', filters, page, pageSize],
    queryFn: () => settingsService.getLogs(filters, page, pageSize),
    enabled: open,
    staleTime: 30_000
  })

  const logs = logsResponse?.data ?? []
  const total = logsResponse?.total ?? 0

  const columns: ColumnDef<APILog>[] = useMemo(
    () => [
      {
        header: 'Zaman',
        accessorKey: 'timestamp',
        cell: ({ row }) => {
          const d = new Date(row.original.timestamp)
          const formatted = `${d.toLocaleDateString('tr-TR')} ${d.toLocaleTimeString('tr-TR')}`
          return <span className='text-muted-foreground text-xs'>{formatted}</span>
        }
      },
      {
        header: 'Endpoint',
        accessorKey: 'endpoint',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <span className='text-xs font-semibold'>
              {row.original.method} {row.original.endpoint}
            </span>
          </div>
        )
      },
      {
        header: 'Durum',
        accessorKey: 'statusCode',
        cell: ({ row }) => {
          const code = row.original.statusCode
          const ok = code >= 200 && code < 300
          const color = ok
            ? 'bg-green-100 text-green-800'
            : code >= 500
              ? 'bg-red-100 text-red-800'
              : 'bg-amber-100 text-amber-800'
          return (
            <span className={cn('inline-flex items-center rounded px-2 py-0.5 text-xs', color)}>
              {ok ? <CheckCircle2 className='mr-1 h-3 w-3' /> : <XCircle className='mr-1 h-3 w-3' />}
              {code}
            </span>
          )
        }
      },
      {
        header: 'Süre',
        accessorKey: 'responseTime',
        cell: ({ row }) => {
          const ms = row.original.responseTime
          const value = ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`
          return <span className='text-xs'>{value}</span>
        }
      },
      {
        header: 'İşlemler',
        cell: ({ row }) => (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              setSelectedLog(row.original)
              setDetailTab('genel')
            }}
          >
            Detay
          </Button>
        )
      }
    ],
    []
  )

  return (
    <Dialog open={open} onOpenChange={o => (!o ? onClose() : null)}>
      <DialogContent size='5xl' className='p-0'>
        <DialogHeader className='p-6 pb-0'>
          <DialogTitle className='flex items-center gap-2'>
            <Bug className='h-5 w-5 text-blue-600' />
            API Logları
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className='max-h-[70vh] p-6 pt-0'>
          <div className='space-y-3'>
            <BasicDataTable
              columns={columns}
              data={logs}
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              isLoading={isLoading}
              columnVisibilityTriggerProps={{
                size: 'xs'
              }}
              toolbar={
                <div className='flex flex-wrap items-end gap-2'>
                  <div className='flex flex-col'>
                    <Select
                      value={filters.success}
                      onValueChange={value =>
                        setFilters(f => ({
                          ...f,
                          success: value as 'all' | 'true' | 'false'
                        }))
                      }
                    >
                      <SelectTrigger className='w-[140px]' size='sm'>
                        <SelectValue placeholder='Tümü' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>Tümü</SelectItem>
                        <SelectItem value='true'>Başarılı</SelectItem>
                        <SelectItem value='false'>Hatalı</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex flex-col'>
                    <div className='flex items-center gap-2'>
                      <div className='relative'>
                        <Input
                          id='endpoint'
                          className='w-[220px]'
                          size='sm'
                          Icon={Search}
                          placeholder='Endpoint...'
                          value={filters.endpoint ?? ''}
                          onChange={e => setFilters(f => ({ ...f, endpoint: e.target.value }))}
                        />
                      </div>
                      <Button variant='soft' color='secondary' size='xs' onClick={() => setFilters({ success: 'all' })}>
                        Temizle
                      </Button>
                      <RefreshButton size='xs' onClick={() => refetch()} isLoading={isFetching} />
                    </div>
                  </div>
                </div>
              }
            />

            <Alert color='info' variant='outline'>
              <AlertCircle className='!size-5' />
              <AlertTitle>API Log Bilgisi</AlertTitle>
              <AlertDescription>
                Bu veriler son 30 gün içerisindeki API isteklerini göstermektedir. Detaylara tıklayarak request/response
                içeriğini inceleyebilirsiniz.
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>
        {/* Detail Dialog */}
        {selectedLog && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
            <div className='bg-background mx-4 w-full max-w-3xl rounded-md border p-4 shadow-xl'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>API Log Detayı</h3>
                <Button variant='link' size='icon' onClick={() => setSelectedLog(null)}>
                  <X className='h-4 w-4' />
                  <span className='sr-only'>Kapat</span>
                </Button>
              </div>
              <Separator className='my-3' />
              <div className='flex gap-2 pb-3'>
                <Button
                  variant={detailTab === 'genel' ? 'outline' : 'ghost'}
                  size='sm'
                  onClick={() => setDetailTab('genel')}
                >
                  Genel Bilgiler
                </Button>
                <Button
                  variant={detailTab === 'request' ? 'outline' : 'ghost'}
                  size='sm'
                  onClick={() => setDetailTab('request')}
                >
                  Request
                </Button>
                <Button
                  variant={detailTab === 'response' ? 'outline' : 'ghost'}
                  size='sm'
                  onClick={() => setDetailTab('response')}
                >
                  Response
                </Button>
              </div>

              {detailTab === 'genel' && (
                <Card>
                  <CardContent className='space-y-2 pt-4 text-sm'>
                    <div className='flex justify-between'>
                      <span className='font-medium'>Endpoint:</span>
                      <span>
                        {selectedLog.method} {selectedLog.endpoint}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium'>Durum Kodu:</span>
                      <Badge
                        color={selectedLog.statusCode >= 200 && selectedLog.statusCode < 300 ? 'success' : 'warning'}
                      >
                        {selectedLog.statusCode}
                      </Badge>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium'>Yanıt Süresi:</span>
                      <span>
                        {selectedLog.responseTime < 1000
                          ? `${selectedLog.responseTime}ms`
                          : `${(selectedLog.responseTime / 1000).toFixed(2)}s`}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium'>Zaman:</span>
                      <span>{new Date(selectedLog.timestamp).toLocaleString('tr-TR')}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
              {detailTab === 'request' && (
                <Card>
                  <CardContent className='pt-4'>
                    <pre className='bg-muted max-h-[300px] overflow-auto rounded p-3 text-xs'>
                      {selectedLog.request || 'Boş request'}
                    </pre>
                  </CardContent>
                </Card>
              )}
              {detailTab === 'response' && (
                <Card>
                  <CardContent className='pt-4'>
                    <pre className='bg-muted max-h-[300px] overflow-auto rounded p-3 text-xs'>
                      {selectedLog.response}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
