'use client'

import { BasicDataTable } from '@/components/basic-data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { Switch } from '@/components/ui/switch'
import { ColumnDef, RowData } from '@tanstack/react-table'
import { Edit, Plus } from 'lucide-react'
import type { PaymentType } from './types'

type Props = {
  data: PaymentType[]
  onEdit: (item: PaymentType) => void
  onToggleActive: (id: string, checked: boolean) => void
  onDelete: (item: PaymentType) => void
  onAddNew: () => void
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    onEdit: (item: TData) => void
    onToggleActive: (id: string, checked: boolean) => void
    onDelete: (item: TData) => void
  }
}

const columns: ColumnDef<PaymentType>[] = [
  {
    accessorKey: 'name',
    header: 'Ödeme Tipi',
    cell: ({ row }) => {
      const p = row.original
      const tag =
        p.type === 'cash' ? (
          <Badge variant='outline' className='border-green-300 text-green-700'>
            Nakit
          </Badge>
        ) : p.type === 'card' ? (
          <Badge variant='outline' className='border-blue-300 text-blue-700'>
            Kart
          </Badge>
        ) : (
          <Badge variant='outline' className='border-purple-300 text-purple-700'>
            Online
          </Badge>
        )

      return (
        <div className='flex flex-col'>
          <span className='font-medium'>{p.name}</span>
          <div className='mt-1'>{tag}</div>
        </div>
      )
    }
  },
  {
    accessorKey: 'terminalId',
    header: 'Terminal ID',
    cell: ({ getValue }) => getValue<string>() || '-'
  },
  {
    accessorKey: 'commissionRate',
    header: 'Komisyon',
    cell: ({ getValue }) => {
      const v = getValue<number | undefined>()
      return v ? `%${v}` : '-'
    }
  },
  {
    id: 'isActive',
    header: 'Durum',
    cell: ({ row, table }) => {
      const p = row.original
      const onToggleActive = table.options.meta?.onToggleActive
      return <Switch key={p.id} checked={p.isActive} onCheckedChange={ch => onToggleActive!(p.id, ch)} />
    }
  },
  {
    id: 'actions',
    header: () => <div className='text-right'>İşlemler</div>,
    cell: ({ row, table }) => {
      const p = row.original
      const onEdit = table.options.meta?.onEdit
      const onDelete = table.options.meta?.onDelete
      return (
        <div className='flex items-center justify-end gap-2'>
          <Button variant='ghost' size='icon-xs' onClick={() => onEdit!(p)}>
            <Edit className='h-4 w-4' />
            <span className='sr-only'>Düzenle</span>
          </Button>
          <DeleteButton size='icon-xs' variant='ghost' isIconButton onDelete={() => onDelete!(p)} />
        </div>
      )
    }
  }
]

export default function PaymentTypesTable({ data, onEdit, onToggleActive, onDelete, onAddNew }: Props) {
  // Pagination kapalı: pageSize = data.length, total verilmez -> tek sayfa
  return (
    <BasicDataTable<PaymentType>
      columns={columns}
      data={data}
      enableColumnVisibility={false}
      enableRowSelection={false}
      emptyLabel='Kayıt bulunamadı'
      loadingLabel='Yükleniyor...'
      toolbar={
        <Button variant='outline' onClick={onAddNew}>
          <Plus className='mr-1 h-4 w-4' />
          Yeni Ödeme Tipi Ekle
        </Button>
      }
      getRowId={row => row.id}
      meta={{ onEdit, onToggleActive, onDelete }}
    />
  )
}
