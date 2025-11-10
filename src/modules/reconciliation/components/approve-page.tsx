import { FormFileField } from '@/components/form/FormFileField'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const approveSchema = z.object({
  invoiceFile: z
    .instanceof(File, { message: 'Fatura dosyası yüklenmesi zorunludur' })
    .refine(file => file.size > 0, { message: 'Dosya seçilmelidir' })
})

type ApproveFormData = z.infer<typeof approveSchema>

interface ApprovePageProps {
  onBack: () => void
  onSubmit: (data: ApproveFormData) => void
  isSubmitting: boolean
}

export function ApprovePage({ onBack, onSubmit, isSubmitting }: ApprovePageProps) {
  const form = useForm<ApproveFormData>({
    resolver: zodResolver(approveSchema),
    defaultValues: {
      invoiceFile: undefined
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col'>
        <div className='flex-1 space-y-6 overflow-y-auto'>
          <div className='space-y-2'>
            <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
              <p className='text-sm font-medium text-red-700'>
                Mutabıkız bildirimi yapıyorsunuz, Faturanızı aşağıdaki alandan yükleyebilirsiniz.
              </p>
            </div>

            <FormFileField
              name='invoiceFile'
              control={form.control}
              label='Yüklenecek Fatura Dosyasını seçiniz:'
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
            <Button type='submit' color='success' className='flex items-center gap-2' disabled={isSubmitting}>
              <Check className='h-4 w-4' />
              {isSubmitting ? 'Gönderiliyor...' : 'Faturayı Gönder'}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  )
}
