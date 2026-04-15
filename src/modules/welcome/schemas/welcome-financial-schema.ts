import { z } from 'zod'

export const welcomeFinancialFormSchema = z
  .object({
    taxOffice: z.string().min(1, '').max(120, 'En fazla 120 karakter'),
    companyName: z.string().min(1, '').max(254, 'En fazla 254 karakter'),
    companyType: z.enum(['Bireysel', 'Kurumsal']),
    tckn: z.string().optional().default(''),
    vkn: z.string().optional().default(''),
    iban: z.string().min(24, '').max(26, 'IBAN en fazla 26 karakter'),
    taxDocumentKey: z.string().min(1, ''),
    idFrontKey: z.string().min(1, ''),
    idBackKey: z.string().min(1, ''),
    signatureCircularKey: z.string().optional().default('')
  })
  .superRefine((data, ctx) => {
    const digits = data.tckn?.replace(/\D/g, '') ?? ''
    if (data.companyType === 'Bireysel') {
      if (digits.length !== 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: data.tckn?.length ? 'T.C. kimlik numarası 11 haneli olmalıdır' : '',
          path: ['tckn']
        })
      }
    } else if (!data.signatureCircularKey?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '',
        path: ['signatureCircularKey']
      })
    }
  })

export type WelcomeFinancialFormValues = z.infer<typeof welcomeFinancialFormSchema>

export const defaultWelcomeFinancialValues: Partial<WelcomeFinancialFormValues> = {
  taxOffice: '',
  companyName: '',
  companyType: 'Bireysel',
  tckn: '',
  vkn: '',
  iban: '',
  taxDocumentKey: '',
  idFrontKey: '',
  idBackKey: '',
  signatureCircularKey: ''
}
