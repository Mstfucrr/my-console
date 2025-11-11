import { FormFileField } from '@/components/form/FormFileField'
import { FormTextareaField } from '@/components/form/FormTextareaField'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const reportSchema = z.object({
  description: z.string().min(1, 'Açıklama girilmesi zorunludur'),
  statementFile: z
    .instanceof(File, { message: 'Cari ekstre dosyası yüklenmesi zorunludur' })
    .refine(file => file.size > 0, { message: 'Dosya seçilmelidir' })
})

type ReportFormData = z.infer<typeof reportSchema>

interface ReportPageProps {
  onBack: () => void
  onSubmit: (data: ReportFormData) => void
  isSubmitting: boolean
}

export function ReportPage({ onBack, onSubmit, isSubmitting }: ReportPageProps) {
  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      description: '',
      statementFile: undefined
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col'>
        <div className='flex-1 space-y-6 overflow-y-auto'>
          <div className='space-y-4'>
            <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
              <p className='text-sm font-medium text-red-700'>
                Mutabık olmadığınızın bildirimini yapıyorsunuz, Neden mutabık olmadığınızı aşağıdaki alanda belirtiniz,
              </p>
            </div>

            <FormTextareaField
              name='description'
              control={form.control}
              label='Neden mutabık olmadığınızı belirtiniz'
              placeholder='Neden mutabık olmadığınızı belirtiniz'
              rows={4}
              autoFocus
              required
            />

            <FormFileField
              name='statementFile'
              control={form.control}
              label='Cari ekstre dosyanızı seçiniz:'
              accept='.pdf,.jpg,.jpeg,.png'
              required
            />
          </div>
        </div>

        <DialogFooter className='-mx-6 mt-5 -mb-6 border-t bg-gray-50 px-6 py-4 pt-4'>
          <div className='flex w-full justify-between'>
            <Button type='button' onClick={onBack} variant='outline' className='flex items-center gap-2'>
              <ArrowLeft className='h-4 w-4' />
              Geri
            </Button>
            <Button type='submit' color='destructive' className='flex items-center gap-2' disabled={isSubmitting}>
              <AlertTriangle className='h-4 w-4' />
              {isSubmitting ? 'Gönderiliyor...' : 'Mutabık Olmadığınızı Bildirin'}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  )
}
