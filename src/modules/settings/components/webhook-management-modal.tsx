'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { BasicDataTable } from '@/components/ui/basic-data-table'
import { Button } from '@/components/ui/button'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Webhook, WebhookEvent } from '@/modules/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { AlertCircle, CheckCircle2, Link2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { settingsService } from '../service'

type Props = {
  open: boolean
  onClose: () => void
}

const EVENT_OPTIONS: { value: WebhookEvent; label: string }[] = [
  { value: 'order.created', label: 'Sipariş Oluşturuldu' },
  { value: 'order.status_changed', label: 'Sipariş Durumu Değişti' },
  { value: 'order.delivered', label: 'Sipariş Teslim Edildi' },
  { value: 'order.cancelled', label: 'Sipariş İptal Edildi' }
]

export default function WebhookManagementModal({ open, onClose }: Props) {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Webhook | null>(null)
  const [url, setUrl] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>([])
  const [isActive, setIsActive] = useState(true)

  const {
    data: webhooks = [],
    isLoading,
    isFetching,
    refetch
  } = useQuery<Webhook[]>({
    queryKey: ['settings-webhooks'],
    queryFn: () => settingsService.getWebhooks(),
    enabled: open,
    staleTime: 30_000,
    placeholderData: keepPreviousData
  })

  const openCreate = () => {
    setEditing(null)
    setUrl('')
    setSelectedEvents(['order.status_changed'])
    setIsActive(true)
    setFormOpen(true)
  }

  const openEdit = (wh: Webhook) => {
    setEditing(wh)
    setUrl(wh.url)
    setSelectedEvents(wh.events)
    setIsActive(wh.isActive)
    setFormOpen(true)
  }

  const handleSubmit = async () => {
    if (!url) {
      toast.error('URL gerekli!')
      return
    }
    try {
      if (editing) {
        await settingsService.updateWebhook(editing.id, { url, events: selectedEvents, isActive })
        toast.success('Webhook güncellendi.')
      } else {
        await settingsService.createWebhook({ url, events: selectedEvents, isActive })
        toast.success('Webhook oluşturuldu.')
      }
      setFormOpen(false)
      refetch()
    } catch (e: unknown) {
      const error = e as Error
      toast.error(error?.message ?? 'İşlem başarısız')
    }
  }

  const columns: ColumnDef<Webhook>[] = useMemo(
    () => [
      {
        header: 'URL',
        accessorKey: 'url',
        cell: ({ row }) => <span className='text-xs break-all'>{row.original.url}</span>
      },
      {
        header: 'Olaylar',
        accessorKey: 'events',
        cell: ({ row }) => (
          <div className='flex flex-wrap gap-1'>
            {row.original.events.map(e => (
              <Badge key={e} variant='outline' className='text-xs'>
                {EVENT_OPTIONS.find(o => o.value === e)?.label ?? e}
              </Badge>
            ))}
          </div>
        )
      },
      {
        header: 'Durum',
        accessorKey: 'isActive',
        cell: ({ row }) => (
          <span
            className={cn(
              'inline-flex items-center rounded px-2 py-0.5 text-xs',
              row.original.isActive ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'
            )}
          >
            <CheckCircle2 className='mr-1 h-3 w-3' />
            {row.original.isActive ? 'Aktif' : 'Pasif'}
          </span>
        ),
        size: 100
      },
      {
        header: 'Son Tetikleme',
        accessorKey: 'lastTriggered',
        cell: ({ row }) => (
          <span className='text-xs'>
            {row.original.lastTriggered ? new Date(row.original.lastTriggered).toLocaleString('tr-TR') : 'Henüz yok'}
          </span>
        ),
        size: 160
      },
      {
        header: 'İşlemler',
        cell: ({ row }) => (
          <div className='flex items-center justify-end gap-1'>
            <Button variant='ghost' size='icon-sm' onClick={() => openEdit(row.original)}>
              <Pencil className='h-4 w-4' />
              <span className='sr-only'>Düzenle</span>
            </Button>
            <DeleteButton
              isIconButton
              variant='ghost'
              size='icon-sm'
              onDelete={() => {
                settingsService.deleteWebhook(row.original.id).then(() => {
                  toast.success('Webhook silindi.')
                  refetch()
                })
              }}
            >
              <Trash2 className='h-4 w-4 text-red-600' />
              <span className='sr-only'>Sil</span>
            </DeleteButton>
          </div>
        ),
        size: 160
      }
    ],
    [refetch]
  )

  return (
    <Dialog open={open} onOpenChange={o => (!o ? onClose() : null)}>
      <DialogContent size='5xl' className='p-0'>
        <DialogHeader className='p-6 pb-0'>
          <DialogTitle className='flex items-center gap-2'>
            <Link2 className='h-5 w-5 text-green-600' />
            Webhook Yönetimi
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className='max-h-[70vh] p-6 pt-0'>
          <div className='space-y-4'>
            <BasicDataTable
              columns={columns}
              data={webhooks}
              isLoading={isLoading || isFetching}
              columnVisibilityTriggerProps={{
                size: 'xs'
              }}
              toolbar={
                <div className='flex items-center gap-2'>
                  <Button onClick={openCreate} size='xs' variant='outline'>
                    <Plus className='mr-2 h-4 w-4' />
                    Yeni Webhook
                  </Button>
                  <RefreshButton size='xs' onClick={refetch} isLoading={isFetching} />
                </div>
              }
            />

            <Alert color='info' variant='outline'>
              <AlertCircle className='!size-5' />
              <AlertTitle>Webhook Bilgisi</AlertTitle>
              <AlertDescription>
                Webhook&apos;lar, sipariş durumu değişikliklerinde sisteminize bildirim gönderir. URL&apos;inizin HTTPS
                olması ve POST isteklerini kabul etmesi gerekir.
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>
        {/* Form Dialog */}
        {formOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
            <div className='bg-background mx-4 w-full max-w-xl rounded-md border p-4 shadow-xl'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>{editing ? 'Webhook Düzenle' : 'Yeni Webhook'}</h3>
                <Button variant='link' size='icon' onClick={() => setFormOpen(false)}>
                  <X className='h-4 w-4' />
                  <span className='sr-only'>Kapat</span>
                </Button>
              </div>
              <Separator className='my-3' />

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='wh-url'>Webhook URL</Label>
                  <Input
                    id='wh-url'
                    placeholder='https://example.com/webhook/fiyuu'
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                  />
                </div>

                <div className='space-y-2'>
                  <Label>Dinlenecek Olaylar</Label>
                  <div className='grid gap-2 md:grid-cols-2'>
                    {EVENT_OPTIONS.map(opt => {
                      const checked = selectedEvents.includes(opt.value)
                      return (
                        <label key={opt.value} className='flex items-center gap-2 text-sm'>
                          <Checkbox
                            checked={checked}
                            onCheckedChange={v => {
                              const val = Boolean(v)
                              setSelectedEvents(prev =>
                                val ? Array.from(new Set([...prev, opt.value])) : prev.filter(x => x !== opt.value)
                              )
                            }}
                          />
                          <span>{opt.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label>Durum</Label>
                  <label className='flex items-center gap-2 text-sm'>
                    <Checkbox checked={isActive} onCheckedChange={v => setIsActive(Boolean(v))} />
                    Aktif
                  </label>
                </div>

                <div className='flex justify-end gap-2'>
                  <Button variant='outline' onClick={() => setFormOpen(false)}>
                    İptal
                  </Button>
                  <Button onClick={handleSubmit}>{editing ? 'Güncelle' : 'Oluştur'}</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
