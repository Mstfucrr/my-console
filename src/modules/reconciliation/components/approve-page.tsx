import { FormFileField } from '@/components/form/FormFileField'
import { Button } from '@/components/ui/button'
import { Form, FormDescription } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const approveSchema = z.object({
  invoiceFile: z
    .instanceof(File, { message: 'Fatura dosyası yüklenmesi zorunludur' })
    .refine(file => file.size > 0, { message: 'Dosya seçilmelidir' })
})

type ApproveFormData = z.infer<typeof approveSchema>

interface ApprovePageProps {
  onSubmit: (data: ApproveFormData) => void
  isSubmitting: boolean
}

export function ApprovePage({ onSubmit, isSubmitting }: ApprovePageProps) {
  const form = useForm<ApproveFormData>({
    resolver: zodResolver(approveSchema),
    defaultValues: {
      invoiceFile: undefined
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col'>
        <div className='flex-1 space-y-6'>
          <div className='space-y-2'>
            <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
              <p className='text-sm font-medium text-red-700'>
                Mutabıkız bildirimi yapıyorsunuz, faturanızı aşağıdaki alandan yükleyebilirsiniz.
              </p>
            </div>

            <FormFileField
              name='invoiceFile'
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
          <Button type='submit' color='success' className='flex items-center gap-2' disabled={isSubmitting}>
            <Check className='h-4 w-4' />
            {isSubmitting ? 'Gönderiliyor...' : 'Faturayı Gönder'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
