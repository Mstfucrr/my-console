import { FormFileField } from '@/components/form/FormFileField'
import { FormTextareaField } from '@/components/form/FormTextareaField'
import { Button } from '@/components/ui/button'
import { Form, FormDescription } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const reportSchema = z.object({
  description: z.string().min(1, 'Açıklama girilmesi zorunludur'),
  statementFile: z
    .instanceof(File, { message: 'Dosyanızı yükleyiniz' })
    .refine(file => file.size > 0, { message: 'Dosya seçilmelidir' })
})

type ReportFormData = z.infer<typeof reportSchema>

interface ReportPageProps {
  onSubmit: (data: ReportFormData) => void
  isSubmitting: boolean
}

export function ReportPage({ onSubmit, isSubmitting }: ReportPageProps) {
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
        <div className='flex-1 space-y-6'>
          <div className='space-y-4'>
            <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
              <p className='text-sm font-medium text-red-700'>
                Mutabık olmadığınızın bildirimini yapıyorsunuz, neden mutabık olmadığınızı aşağıdaki alanda belirtiniz.
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
              label='Dosya Seçiniz'
              accept='.jpeg,.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
              required
              maxSize={10 * 1024 * 1024}
            />
            <FormDescription className='text-muted-foreground text-xs'>
              Dosya boyutu 10MB&apos;den büyük olamaz.
            </FormDescription>
          </div>
        </div>

        <div className='flex w-full justify-between py-4'>
          <Button type='submit' color='destructive' className='flex items-center gap-2' disabled={isSubmitting}>
            <AlertTriangle className='h-4 w-4' />
            {isSubmitting ? 'Gönderiliyor...' : 'Mutabık Olmadığınızı Bildirin'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
