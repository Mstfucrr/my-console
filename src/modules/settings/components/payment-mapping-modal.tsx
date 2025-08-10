'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { BasicDataTable } from '@/components/ui/basic-data-table'
import { Button } from '@/components/ui/button'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import type { FiyuuPaymentType, PaymentMapping } from '@/modules/types'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { AlertCircle, ArrowRight, CreditCard, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { settingsService } from '../service'

type Props = {
  open: boolean
  onClose: () => void
}

const PAYMENT_TYPES: { value: FiyuuPaymentType; label: string; icon: string }[] = [
  { value: 'cash', label: 'Nakit', icon: '💵' },
  { value: 'card', label: 'Kredi/Banka Kartı', icon: '💳' },
  { value: 'online', label: 'Online Ödeme', icon: '🌐' },
  { value: 'wallet', label: 'Dijital Cüzdan', icon: '📱' }
]

export default function PaymentMappingModal({ open, onClose }: Props) {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<PaymentMapping | null>(null)
  const [clientValue, setClientValue] = useState('')
  const [fiyuuValue, setFiyuuValue] = useState<FiyuuPaymentType | ''>('')

  const {
    data: mappings = [],
    isLoading,
    isFetching,
    refetch
  } = useQuery<PaymentMapping[]>({
    queryKey: ['settings-mappings'],
    queryFn: () => settingsService.getMappings(),
    enabled: open,
    staleTime: 30_000
  })

  const openCreate = () => {
    setEditing(null)
    setClientValue('')
    setFiyuuValue('')
    setFormOpen(true)
  }

  const openEdit = (mp: PaymentMapping) => {
    setEditing(mp)
    setClientValue(mp.clientValue)
    setFiyuuValue(mp.fiyuuValue as FiyuuPaymentType)
    setFormOpen(true)
  }

  const handleSubmit = async () => {
    if (!clientValue || !fiyuuValue) {
      toast.error('Tüm alanları doldurun.')
      return
    }
    try {
      if (editing) {
        await settingsService.updateMapping(editing.id, { clientValue, fiyuuValue })
        toast.success('Eşleştirme güncellendi.')
      } else {
        await settingsService.createMapping({ clientValue: clientValue.toLowerCase(), fiyuuValue })
        toast.success('Eşleştirme oluşturuldu.')
      }
      setFormOpen(false)
      refetch()
    } catch (e: unknown) {
      const error = e as Error
      toast.error(error?.message ?? 'İşlem başarısız')
    }
  }

  const handleDelete = useCallback(
    async (mp: PaymentMapping) => {
      if (!confirm('Bu eşleştirmeyi silmek istediğinize emin misiniz?')) return
      await settingsService.deleteMapping(mp.id)
      toast.success('Eşleştirme silindi.')
      refetch()
    },
    [refetch]
  )

  const getFiyuuPaymentLabel = (type: FiyuuPaymentType) => {
    const t = PAYMENT_TYPES.find(p => p.value === type)
    return t ? `${t.icon} ${t.label}` : type
  }

  const columns: ColumnDef<PaymentMapping>[] = useMemo(
    () => [
      {
        header: 'Sisteminizdeki Değer',
        accessorKey: 'clientValue',
        cell: ({ row }) => (
          <span className='rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800'>{row.original.clientValue}</span>
        )
      },
      {
        header: 'Eşleştirme',
        cell: () => <ArrowRight className='h-4 w-4 text-blue-600' />,
        size: 80
      },
      {
        header: 'Fiyuu Karşılığı',
        accessorKey: 'fiyuuValue',
        cell: ({ row }) => (
          <span className='rounded bg-green-100 px-2 py-0.5 text-xs text-green-800'>
            {getFiyuuPaymentLabel(row.original.fiyuuValue as FiyuuPaymentType)}
          </span>
        )
      },
      {
        header: 'Oluşturulma',
        accessorKey: 'createdAt',
        cell: ({ row }) => (
          <span className='text-xs'>{new Date(row.original.createdAt).toLocaleDateString('tr-TR')}</span>
        ),
        size: 120
      },
      {
        header: 'İşlemler',
        cell: ({ row }) => (
          <div className='flex items-center justify-end gap-1'>
            <Button variant='ghost' size='icon-sm' onClick={() => openEdit(row.original)}>
              <Pencil className='h-4 w-4' />
              <span className='sr-only'>Düzenle</span>
            </Button>
            <DeleteButton isIconButton variant='ghost' size='icon-sm' onDelete={() => handleDelete(row.original)}>
              <Trash2 className='h-4 w-4 text-red-600' />
              <span className='sr-only'>Sil</span>
            </DeleteButton>
          </div>
        ),
        size: 160
      }
    ],
    [handleDelete]
  )

  return (
    <Dialog open={open} onOpenChange={o => (!o ? onClose() : null)}>
      <DialogContent size='5xl' className='p-0'>
        <DialogHeader className='p-6 pb-0'>
          <DialogTitle className='flex items-center gap-2'>
            <CreditCard className='h-5 w-5 text-orange-500' />
            Ödeme Tipi Eşleştirme
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className='max-h-[70vh] p-6 pt-0'>
          <div className='space-y-4'>
            <BasicDataTable
              columns={columns}
              data={mappings}
              isLoading={isLoading}
              columnVisibilityTriggerProps={{
                size: 'xs'
              }}
              toolbar={
                <div className='flex items-center gap-2'>
                  <Button onClick={openCreate} size='xs' variant='outline'>
                    <Plus className='mr-2 h-4 w-4' />
                    Yeni Eşleştirme
                  </Button>
                  <RefreshButton size='xs' onClick={() => refetch()} isLoading={isFetching} />
                </div>
              }
            />

            <Alert color='info' variant='outline'>
              <AlertCircle className='!size-5' />
              <AlertTitle>Ödeme Eşleştirme Bilgisi</AlertTitle>
              <AlertDescription>
                Sisteminizden gelen ödeme tipleri Fiyuu&apos;nun standart ödeme tiplerine eşleştirilir. Bu sayede
                sipariş aktarımında ödeme bilgileri doğru şekilde işlenir.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Örnek Kullanım</CardTitle>
              </CardHeader>
              <CardContent className='text-sm'>
                <div className='mb-2 font-semibold'>API İsteğinizde:</div>
                <pre className='bg-muted mb-3 rounded p-2 text-xs'>{`{
  "paymentType": "nakit",
  "amount": 50.00
}`}</pre>
                <div className='mb-2 font-semibold'>Fiyuu sisteminde:</div>
                <pre className='rounded bg-emerald-50 p-2 text-xs'>{`{
  "paymentType": "cash",
  "amount": 50.00
}`}</pre>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        {/* Form Dialog */}
        {formOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
            <div className='bg-background mx-4 w-full max-w-lg rounded-md border p-4 shadow-xl'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>{editing ? 'Eşleştirme Düzenle' : 'Yeni Eşleştirme'}</h3>
                <Button variant='link' size='icon' onClick={() => setFormOpen(false)}>
                  <X className='h-4 w-4' />
                  <span className='sr-only'>Kapat</span>
                </Button>
              </div>
              <Separator className='my-3' />

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='clientValue'>Sisteminizdeki Değer</Label>
                  <Input
                    id='clientValue'
                    placeholder='örn: nakit, kredi_karti, online_odeme'
                    value={clientValue}
                    onChange={e => setClientValue(e.target.value)}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='fiyuuValue'>Fiyuu Karşılığı</Label>
                  <Select value={fiyuuValue} onValueChange={value => setFiyuuValue(value as FiyuuPaymentType)}>
                    <SelectTrigger>
                      <SelectValue placeholder='Seçin' />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.icon} {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Alert color='warning' variant='outline'>
                  <AlertCircle className='!size-5' />
                  <AlertTitle>Önemli Not</AlertTitle>
                  <AlertDescription>
                    Sisteminizden gelen değerin tam olarak eşleşmesi gerekmektedir. Büyük/küçük harf duyarlıdır.
                  </AlertDescription>
                </Alert>

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
