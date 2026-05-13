import { EMAIL_REGEX, ONLY_LETTERS_REGEX, VKN_REGEX } from '@/lib/regex'
import { z } from 'zod'

export const onboardingContactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, '')
    .max(100, 'Adınız en fazla 100 karakter olabilir')
    .regex(ONLY_LETTERS_REGEX, 'Yalnızca harf kullanılabilir')
    .default(''),
  surname: z
    .string()
    .min(1, '')
    .max(100, 'Soyadınız en fazla 100 karakter olabilir')
    .regex(ONLY_LETTERS_REGEX, 'Yalnızca harf kullanılabilir')
    .default(''),
  phoneNumber: z
    .string()
    .min(1, '')
    .default('')
    .refine(value => value.length === 10, { message: '' }),
  email: z
    .string()
    .min(1, '')
    .email('Geçersiz e-posta adresi')
    .default('')
    .refine(value => EMAIL_REGEX.test(value), { message: 'Geçersiz e-posta adresi' }),
  taxNumber: z
    .string()
    .min(1, '')
    .min(10, 'VKN 10 haneli olmalıdır')
    .max(10, 'VKN en fazla 10 haneli olmalıdır')
    .default('')
    .refine(value => VKN_REGEX.test(value), { message: 'Geçersiz VKN' }),
  kvkkAccepted: z.boolean().refine(v => v === true, { message: '' })
})

export type OnboardingContactFormValues = z.infer<typeof onboardingContactFormSchema>

export const defaultOnboardingContactFormValues: OnboardingContactFormValues = {
  firstName: '',
  surname: '',
  phoneNumber: '',
  email: '',
  taxNumber: '',
  kvkkAccepted: false
}
