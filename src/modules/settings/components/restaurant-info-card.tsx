'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building, Edit } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

interface RestaurantInfo {
  iban: string
  taxNumber: string
  title: string
  address: string
  phone: string
  email: string
}

interface RestaurantInfoCardProps {
  restaurantInfo: RestaurantInfo
  onRestaurantInfoUpdate: (info: RestaurantInfo) => void
}

const restaurantInfoSchema = z.object({
  title: z.string().min(1, 'Ünvan gereklidir'),
  taxNumber: z.string().min(1, 'Vergi numarası gereklidir'),
  iban: z.string().min(1, 'IBAN gereklidir'),
  address: z.string().min(1, 'Adres gereklidir'),
  phone: z.string().min(1, 'Telefon gereklidir'),
  email: z.string().email('Geçerli e-posta gereklidir')
})

export default function RestaurantInfoCard({ restaurantInfo, onRestaurantInfoUpdate }: RestaurantInfoCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const form = useForm<z.infer<typeof restaurantInfoSchema>>({
    resolver: zodResolver(restaurantInfoSchema),
    defaultValues: restaurantInfo
  })

  const onSubmit = (values: z.infer<typeof restaurantInfoSchema>) => {
    onRestaurantInfoUpdate(values)
    toast.success('Restoran bilgileri güncellendi')
    setModalOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between gap-2 space-y-0 pb-2'>
          <CardTitle className='flex items-center gap-2 max-sm:text-base'>
            <Building className='h-5 w-5 text-red-600' />
            Restoran Bilgileri
          </CardTitle>
          <Button className='flex items-center gap-2' variant='outline' onClick={() => setModalOpen(true)}>
            <Edit className='h-4 w-4' />
            <span className='max-sm:hidden'>Düzenle</span>
          </Button>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <p className='text-muted-foreground text-sm'>IBAN:</p>
            <p className='font-medium'>{restaurantInfo.iban}</p>
          </div>
          <div>
            <p className='text-muted-foreground text-sm'>Vergi No:</p>
            <p className='font-medium'>{restaurantInfo.taxNumber}</p>
          </div>
          <div>
            <p className='text-muted-foreground text-sm'>Ünvan:</p>
            <p className='font-medium'>{restaurantInfo.title}</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent size='xl'>
          <DialogHeader>
            <DialogTitle>Restoran Bilgilerini Düzenle</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restoran Ünvanı</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='taxNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vergi Numarası</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='iban'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IBAN</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adres</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-posta</FormLabel>
                      <FormControl>
                        <Input type='email' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex justify-end gap-2'>
                <Button type='button' variant='outline' onClick={() => setModalOpen(false)}>
                  İptal
                </Button>
                <Button type='submit'>Kaydet</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
