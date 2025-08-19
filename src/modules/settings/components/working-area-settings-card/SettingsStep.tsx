'use client'

import { FormInputField } from '@/components/form/FormInputField'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

import type { WorkingArea, WorkingAreaFormData } from './types'

interface SettingsStepProps {
  form: UseFormReturn<WorkingAreaFormData>
  selected: WorkingArea
  selectedNeighborhoods: string[]
  goBack: () => void
  onSubmit: (values: WorkingAreaFormData) => void
}

export function SettingsStep({ form, selected, selectedNeighborhoods, goBack, onSubmit }: SettingsStepProps) {
  return (
    <div className='space-y-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormInputField control={form.control} name='name' label='Alan Adı' placeholder='Örn: Kadıköy Merkez' />

          <FormSwitchField control={form.control} name='isActive' label='Bu alanı aktif et' />

          <Alert variant='outline' color='info'>
            <AlertDescription>
              <strong>Özet:</strong> {selected.type === 'polygon' ? 'Poligon' : 'Mahalle'} tipi alan oluşturulacak.
              {selected.type === 'neighborhood' &&
                selectedNeighborhoods.length > 0 &&
                ` Seçilen mahalleler: ${selectedNeighborhoods.join(', ')}`}
            </AlertDescription>
          </Alert>

          <div className='flex justify-between'>
            <Button type='button' variant='outline' onClick={goBack}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Geri
            </Button>
            <Button type='submit'>
              Kaydet
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
