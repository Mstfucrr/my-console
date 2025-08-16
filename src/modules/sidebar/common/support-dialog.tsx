'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

const supportFormSchema = z.object({
  subject: z.string().min(1, 'Lütfen bir konu giriniz'),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Lütfen öncelik seçiniz'
  }),
  message: z.string().min(10, 'Mesajınız en az 10 karakter olmalıdır')
})

type SupportFormValues = z.infer<typeof supportFormSchema>

export function SupportDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      subject: '',
      priority: undefined,
      message: ''
    }
  })

  const onSubmit = async (values: SupportFormValues) => {
    setIsSubmitting(true)
    try {
      // TODO: API call to send message/ticket
      console.log('Mesaj gönderiliyor:', values)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapılacaktır.')
      setOpen(false)
      form.reset()
    } catch (error) {
      toast.error('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'Düşük'
      case 'medium':
        return 'Orta'
      case 'high':
        return 'Yüksek'
      default:
        return ''
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' className='relative size-9'>
          <MessageCircle className='size-6' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Destek Ekibine Mesaj Gönder</DialogTitle>
          <DialogDescription>
            Sorununuzu veya talebinizi detaylı bir şekilde açıklayın. En kısa sürede size dönüş yapacağız.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='subject'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konu</FormLabel>
                  <FormControl>
                    <Input placeholder='Mesaj konusu' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='priority'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Öncelik</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Öncelik seçiniz' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='low'>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor('low')}`}>
                          Düşük
                        </span>
                      </SelectItem>
                      <SelectItem value='medium'>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor('medium')}`}>
                          Orta
                        </span>
                      </SelectItem>
                      <SelectItem value='high'>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor('high')}`}>
                          Yüksek
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mesaj</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Lütfen sorununuzu veya talebinizi detaylı bir şekilde açıklayınız...'
                      className='min-h-[120px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => setOpen(false)} disabled={isSubmitting}>
                İptal
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
