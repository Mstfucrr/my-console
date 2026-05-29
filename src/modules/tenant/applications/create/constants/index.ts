import { ONLY_LETTERS_REGEX, PHONE_REGEX } from '@/lib/regex'
import { z } from 'zod'
import type { StoreWorkingHoursDay } from '../../types/working-hours'
import { isValidWorkingHourTime, workingHourDigitsToMinutes } from '../utils/working-hour-time'

export const APPLICATION_STEPS = [
  { key: 'location', label: 'Konum Bilgileri' },
  { key: 'branch', label: 'Şube Bilgileri' },
  { key: 'workingHours', label: 'Çalışma Saatleri' }
] as const

/** Sihirbaz adım sırası — `APPLICATION_STEPS` ile aynı uzunlukta ve sıraya bağlıdır */
export enum StoreApplicationWizardStepIndex {
  Location = 0,
  Branch = 1,
  WorkingHours = 2
}

/** Varsayılan haftalık şablon — formda düzenlenir */
export const DEFAULT_WORKING_HOURS: StoreWorkingHoursDay[] = [
  { day: 'monday', enabled: true, intervals: [{ start: null, end: null }] },
  { day: 'tuesday', enabled: true, intervals: [{ start: null, end: null }] },
  { day: 'wednesday', enabled: true, intervals: [{ start: null, end: null }] },
  { day: 'thursday', enabled: true, intervals: [{ start: null, end: null }] },
  { day: 'friday', enabled: true, intervals: [{ start: null, end: null }] },
  { day: 'saturday', enabled: true, intervals: [{ start: null, end: null }] },
  { day: 'sunday', enabled: true, intervals: [{ start: null, end: null }] }
]

export const DAY_LABELS_TR: Record<string, string> = {
  monday: 'Pazartesi',
  tuesday: 'Salı',
  wednesday: 'Çarşamba',
  thursday: 'Perşembe',
  friday: 'Cuma',
  saturday: 'Cumartesi',
  sunday: 'Pazar'
}

/** Çalışma saati aralığı — Zod ve UI ile ortak kullanım */
export const WORKING_HOURS_VALIDATION_MESSAGES = {
  openingRequired: '',
  closingRequired: '',
  invalidOpening: 'Geçerli başlangıç saati giriniz',
  invalidClosing: 'Geçerli bitiş saati giriniz',
  endAfterStart: 'Bitiş saati başlangıç saatinden sonra olmalıdır',
  startAfterPreviousEnd: 'Başlangıç saati önceki aralığın bitişinden büyük olmalıdır'
} as const

export const workingHourIntervalSchema = z.object({
  start: z.string().nullable(),
  end: z.string().nullable()
})

export type WorkingHourInterval = z.infer<typeof workingHourIntervalSchema>

/** Zod şeması ile hizalı FE çalışma saati gün satırı (`StoreWorkingHoursDay`). */
export type WorkingHourRow = StoreWorkingHoursDay

export const workingHourRowSchema = z
  .object({
    day: z.string(),
    enabled: z.boolean(),
    intervals: z.array(workingHourIntervalSchema)
  })
  .superRefine((row, ctx) => {
    if (!row.enabled) return

    let previousEndMinutes: number | null = null

    row.intervals.forEach((interval, index) => {
      const startValid = isValidWorkingHourTime(interval.start)
      const endValid = isValidWorkingHourTime(interval.end)

      if (!interval.start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: WORKING_HOURS_VALIDATION_MESSAGES.openingRequired,
          path: ['intervals', index, 'start']
        })
      }
      if (!interval.end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: WORKING_HOURS_VALIDATION_MESSAGES.closingRequired,
          path: ['intervals', index, 'end']
        })
      }

      if (!startValid && interval.start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: WORKING_HOURS_VALIDATION_MESSAGES.invalidOpening,
          path: ['intervals', index, 'start']
        })
      }

      if (!endValid && interval.end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: WORKING_HOURS_VALIDATION_MESSAGES.invalidClosing,
          path: ['intervals', index, 'end']
        })
      }

      if (!startValid || !endValid) return

      const startMinutes = workingHourDigitsToMinutes(interval.start)
      const endMinutes = workingHourDigitsToMinutes(interval.end)

      if (startMinutes == null || endMinutes == null) return

      if (startMinutes >= endMinutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: WORKING_HOURS_VALIDATION_MESSAGES.endAfterStart,
          path: ['intervals', index, 'end']
        })
      }

      if (previousEndMinutes != null && startMinutes <= previousEndMinutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: WORKING_HOURS_VALIDATION_MESSAGES.startAfterPreviousEnd,
          path: ['intervals', index, 'start']
        })
      }

      previousEndMinutes = endMinutes
    })
  })

export const locationFormSchema = z.object({
  city: z.object({
    id: z.string().min(1, ''),
    name: z.string()
  }),
  county: z.object({
    id: z.string().min(1, ''),
    name: z.string()
  }),
  district: z.object({
    id: z.string().min(1, ''),
    name: z.string()
  }),
  street: z.string().min(1, '').max(120, 'Sokak en fazla 120 karakter olabilir'),
  doorNumber: z.string().min(1, '').max(20, 'Kapı numarası en fazla 20 karakter olabilir'),
  buildingNumber: z.string().max(20).optional().default(''),
  floor: z.string().max(3).optional().default(''),
  buildingName: z.string().max(100).optional().default(''),
  fullAddress: z.string().min(1, '').max(500, 'Açık adres en fazla 500 karakter olabilir'),
  latitude: z.number({ invalid_type_error: '' }),
  longitude: z.number({ invalid_type_error: '' })
})

export type LocationFormData = z.infer<typeof locationFormSchema>

export const branchFormSchema = z.object({
  restaurantName: z.string().min(1, '').max(254, 'Şube adı en fazla 254 karakter olabilir').default(''),
  sector: z.string().min(1, ''),
  subSectors: z.array(z.string()).min(1, 'En az bir alt sektör zorunludur'),
  /** Formda boş başlar (placeholder); gönderimde `min(1)` ile zorunlu. Sayıya dönüşüm payload’da yapılır. */
  dailyPackageEstimate: z.string().min(1, '').max(6, 'Günlük paket tahmini en fazla 6 haneli olabilir'),
  authFirstName: z
    .string()
    .min(1, '')
    .max(100, 'Adınız en fazla 100 karakter olabilir')
    .regex(ONLY_LETTERS_REGEX, 'Yalnızca harf kullanılabilir'),
  authSurname: z
    .string()
    .min(1, '')
    .max(100, 'Soyadınız en fazla 100 karakter olabilir')
    .regex(ONLY_LETTERS_REGEX, 'Yalnızca harf kullanılabilir'),
  authPhoneNumber: z
    .string()
    .length(10, '')
    .refine(v => PHONE_REGEX.test(v), 'Geçerli bir cep telefonu giriniz'),
  authEmail: z.string().min(1, '').email('Geçerli e-posta giriniz')
})

export type BranchFormData = z.infer<typeof branchFormSchema>

export const workingHoursFormSchema = z.object({
  workingHours: z.array(workingHourRowSchema)
})

export type WorkingHoursFormData = z.infer<typeof workingHoursFormSchema>

export const createStoreApplicationSchema = locationFormSchema.merge(branchFormSchema).merge(workingHoursFormSchema)

export type CreateStoreApplicationFormData = z.infer<typeof createStoreApplicationSchema>

export const defaultLocationFormValues: LocationFormData = {
  city: { id: '', name: '' },
  county: { id: '', name: '' },
  district: { id: '', name: '' },
  street: '',
  doorNumber: '',
  buildingNumber: '',
  floor: '',
  buildingName: '',
  fullAddress: '',
  latitude: 41.0082,
  longitude: 28.9784
}

export const defaultBranchFormValues: BranchFormData = {
  restaurantName: '',
  sector: '',
  subSectors: [],
  dailyPackageEstimate: '',
  authFirstName: '',
  authSurname: '',
  authPhoneNumber: '',
  authEmail: ''
}

export const defaultWorkingHoursFormValues: WorkingHoursFormData = {
  workingHours: DEFAULT_WORKING_HOURS.map(h => ({ ...h }))
}

/** Birleşik başvuru verisi — API öncesi merge ve legacy için */
export const defaultCreateStoreApplicationValues: CreateStoreApplicationFormData = {
  ...defaultLocationFormValues,
  ...defaultBranchFormValues,
  ...defaultWorkingHoursFormValues
}
