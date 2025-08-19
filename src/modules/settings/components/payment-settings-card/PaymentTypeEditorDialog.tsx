'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { FormInputField } from '@/components/form/FormInputField'
import { FormSelectField } from '@/components/form/FormSelectField'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'

import { PAYMENT_TYPE_OPTIONS, paymentTypeSchema, type PaymentType, type PaymentTypeFormValues } from './types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues: PaymentType | null
  onSubmit: (values: PaymentTypeFormValues) => void
}

export default function PaymentTypeEditorDialog({ open, onOpenChange, initialValues, onSubmit }: Props) {
  const form = useForm<PaymentTypeFormValues>({
    resolver: zodResolver(paymentTypeSchema),
    defaultValues: {
      name: '',
      type: 'card',
      terminalId: '',
      commissionRate: undefined,
      isActive: false
    },
    values: useMemo(
      () =>
        initialValues
          ? {
              name: initialValues.name ?? '',
              type: initialValues.type ?? 'card',
              terminalId: initialValues.terminalId ?? '',
              commissionRate:
                initialValues.commissionRate === undefined ? undefined : Number(initialValues.commissionRate),
              isActive: !!initialValues.isActive
            }
          : undefined,
      [initialValues]
    ),
    mode: 'all'
  })

  const options = useMemo(() => PAYMENT_TYPE_OPTIONS.map(o => ({ value: o.value, label: o.label })), [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size='md'>
        <DialogHeader>
          <DialogTitle>{initialValues?.id ? 'Ödeme Tipi Düzenle' : 'Yeni Ödeme Tipi'}</DialogTitle>
        </DialogHeader>

        {/* RHF + senin form bileşenlerin */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(vals => {
              onSubmit(vals)
              onOpenChange(false)
              form.reset()
            })}
            className='space-y-4'
          >
            <FormInputField control={form.control} name='name' label='Ödeme Tipi Adı' placeholder='Örn: Yemek Kartı' />

            <FormSelectField
              control={form.control}
              name='type'
              label='Tip'
              placeholder='Tip seçiniz'
              options={options}
            />

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <FormInputField control={form.control} name='terminalId' label='Terminal ID' placeholder='TRM001' />
              <FormInputField
                control={form.control}
                name='commissionRate'
                label='Komisyon Oranı (%)'
                type='number'
                placeholder='2.5'
              />
            </div>

            <FormSwitchField
              key={initialValues?.id ?? 'new'}
              control={form.control}
              name='isActive'
              label='Bu ödeme tipini aktif et'
            />

            <div className='flex justify-end gap-2 pt-2'>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button type='submit'>Kaydet</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
