'use client'

import { FormCommandSelectField } from '@/components/form/FormCommandSelectField'
import { FormInputField } from '@/components/form/FormInputField'
import { FormTextareaField } from '@/components/form/FormTextareaField'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { LoadingButton } from '@/components/ui/loading-button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { authService } from '../service/auth.service'

const cities = [
  'Adana',
  'Adıyaman',
  'Afyonkarahisar',
  'Ağrı',
  'Amasya',
  'Ankara',
  'Antalya',
  'Artvin',
  'Aydın',
  'Balıkesir',
  'Bilecik',
  'Bingöl',
  'Bitlis',
  'Bolu',
  'Burdur',
  'Bursa',
  'Çanakkale',
  'Çankırı',
  'Çorum',
  'Denizli',
  'Diyarbakır',
  'Edirne',
  'Elazığ',
  'Erzincan',
  'Erzurum',
  'Eskişehir',
  'Gaziantep',
  'Giresun',
  'Gümüşhane',
  'Hakkari',
  'Hatay',
  'Isparta',
  'Mersin',
  'İstanbul',
  'İzmir',
  'Kars',
  'Kastamonu',
  'Kayseri',
  'Kırklareli',
  'Kırşehir',
  'Kocaeli',
  'Konya',
  'Kütahya',
  'Malatya',
  'Manisa',
  'Kahramanmaraş',
  'Mardin',
  'Muğla',
  'Muş',
  'Nevşehir',
  'Niğde',
  'Ordu',
  'Rize',
  'Sakarya',
  'Samsun',
  'Siirt',
  'Sinop',
  'Sivas',
  'Tekirdağ',
  'Tokat',
  'Trabzon',
  'Tunceli',
  'Şanlıurfa',
  'Uşak',
  'Van',
  'Yozgat',
  'Zonguldak',
  'Aksaray',
  'Bayburt',
  'Karaman',
  'Kırıkkale',
  'Batman',
  'Şırnak',
  'Bartın',
  'Ardahan',
  'Iğdır',
  'Yalova',
  'Karabük',
  'Kilis',
  'Osmaniye',
  'Düzce'
]

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'En az 2 karakter olmalıdır' }),
  lastName: z.string().min(2, { message: 'En az 2 karakter olmalıdır' }),
  email: z.string().email({ message: 'Geçerli bir e-posta adresi giriniz' }),
  phone: z
    .string()
    .min(10, { message: 'Telefon numarası gereklidir' })
    .regex(/^[0-9+\s\-()]{10,}$/i, { message: 'Geçerli bir telefon numarası giriniz' }),
  companyName: z.string().min(2, { message: 'En az 2 karakter olmalıdır' }),
  city: z.string().min(1, { message: 'İl seçimi gereklidir' }),
  address: z.string().min(10, { message: 'En az 10 karakter olmalıdır' }),
  kvkkAccepted: z.literal(true, {
    errorMap: () => ({ message: 'KVKK sözleşmesini kabul etmelisiniz' })
  })
})

export type SignUpFormType = z.infer<typeof formSchema>

export function SignUpForm() {
  const router = useRouter()

  const { mutateAsync: signup, isPending } = useMutation({
    mutationFn: authService.signup,
    mutationKey: ['signup']
  })

  const form = useForm<SignUpFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: 'ahmet',
      lastName: 'yılmaz',
      email: 'ahmet@gmail.com',
      phone: '5321234567',
      companyName: 'fiyuu',
      city: 'İstanbul',
      address: 'İstanbul Bağcılar'
    },
    mode: 'all'
  })

  const { control, handleSubmit } = form

  const onSubmit = (data: SignUpFormType) => {
    toast.promise(
      async () => {
        await signup(data)
        router.push('/onboarding')
      },
      {
        pending: 'Hesap oluşturuluyor...',
        success: 'Başarıyla kayıt oldunuz',
        error: 'Kayıt oluşturulurken bir hata oluştu'
      }
    )
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <FormInputField name='firstName' control={control} label='Adınız' />
          <FormInputField name='lastName' control={control} label='Soyadınız' />

          <FormInputField name='email' control={control} label='E-Posta Adresiniz' type='email' />
          <FormInputField name='phone' control={control} label='Cep Telefonunuz' />
          <FormInputField name='companyName' control={control} label='Firma Adı' />

          <FormCommandSelectField
            name='city'
            control={control}
            label='İl'
            searchPlaceholder='İl ara'
            placeholder='İl seçiniz'
            options={cities.map(city => ({ value: city, label: city }))}
          />
        </div>

        <FormTextareaField name='address' control={control} label='Adres' rows={3} />

        <Alert color='info' variant='soft'>
          <AlertTitle>KVKK Bilgilendirme</AlertTitle>
          <AlertDescription>
            Kişisel verileriniz, hizmet kalitesini artırmak ve size özel deneyimler sunmak amacıyla 6698 sayılı Kişisel
            Verilerin Korunması Kanunu kapsamında işlenecektir. Detaylı bilgi için{' '}
            <Link href='/kvkk' target='_blank' className='underline'>
              KVKK Sözleşmesi
            </Link>
            &apos;ni inceleyebilirsiniz.
          </AlertDescription>
        </Alert>

        <FormField
          control={control}
          name='kvkkAccepted'
          render={({ field, fieldState }) => (
            <FormItem className='flex flex-col space-y-2'>
              <div className='flex items-start space-x-2'>
                <FormControl>
                  <Checkbox id='kvkkAccepted' checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel htmlFor='kvkkAccepted' className='text-sm font-normal'>
                  <Link href='/kvkk' target='_blank' className='underline'>
                    KVKK Sözleşmesi
                  </Link>
                  &apos;ni okudum, anladım ve kabul ediyorum.
                </FormLabel>
              </div>
              {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
            </FormItem>
          )}
        />

        <LoadingButton
          type='submit'
          className='w-full'
          size='lg'
          isLoading={isPending}
          loadingText='Hesap oluşturuluyor...'
        >
          Hesap Oluştur
        </LoadingButton>
      </form>
    </FormProvider>
  )
}
