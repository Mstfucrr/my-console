'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { toast } from 'react-toastify'

import PaymentTypeEditorDialog from './PaymentTypeEditorDialog'
import PaymentTypesTable from './PaymentTypesTable'
import type { PaymentType, PaymentTypeFormValues } from './types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentTypes: PaymentType[]
  onChange: (id: string, data: Partial<PaymentType>) => void
  onToggleActive: (id: string, checked: boolean) => void
  onAddNew: (payment: PaymentType) => void
  onDelete: (id: string) => void
}

export default function PaymentTypesModal({
  open,
  onOpenChange,
  paymentTypes,
  onChange,
  onToggleActive,
  onAddNew,
  onDelete
}: Props) {
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<PaymentType | null>(null)

  const handleAddNew = () => {
    const newPayment: PaymentType = {
      id: '',
      name: '',
      type: 'card',
      isActive: false,
      terminalId: '',
      commissionRate: undefined
    }
    setEditing(newPayment)
    setEditorOpen(true)
  }

  const handleEdit = (item: PaymentType) => {
    setEditing(item)
    setEditorOpen(true)
  }

  const handleSave = (vals: PaymentTypeFormValues) => {
    if (editing?.id) {
      // update
      onChange(editing.id, vals)
      toast.success('Ödeme tipi güncellendi')
    } else {
      // create
      const newPayment: PaymentType = {
        id: Date.now().toString(),
        name: vals.name,
        type: vals.type,
        isActive: vals.isActive,
        terminalId: vals.terminalId || '',
        commissionRate: vals.commissionRate === undefined ? undefined : Number(vals.commissionRate)
      }
      onAddNew(newPayment)
      toast.success('Ödeme tipi eklendi')
    }
    setEditing(null)
  }

  const handleConfirmDelete = (item: PaymentType) => {
    onDelete(item.id)
    toast.success('Ödeme tipi silindi')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size='2xl'>
        <DialogHeader className='mb-2'>
          <DialogTitle>Ödeme Tipi Yönetimi</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader className='py-3'>
            <CardTitle className='text-base'>Kayıtlar</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentTypesTable
              data={paymentTypes}
              onEdit={handleEdit}
              onToggleActive={onToggleActive}
              onDelete={handleConfirmDelete}
              onAddNew={handleAddNew}
            />
          </CardContent>
        </Card>

        {/* Editor */}
        <PaymentTypeEditorDialog
          open={editorOpen}
          onOpenChange={o => {
            setEditorOpen(o)
            if (!o) setEditing(null)
          }}
          initialValues={editing}
          onSubmit={handleSave}
        />
      </DialogContent>
    </Dialog>
  )
}
