import { Clock, CreditCard, LineChart, MessageCircle } from 'lucide-react'

export const INTRO_STATS = [
  { value: '5 dk', label: 'Ortalama başvuru süresi' },
  { value: '4', label: 'Kolay adım' },
  { value: '7 gün', label: '21 Saat canlı destek' },
  { value: '40+', label: 'POS firması ile entegre' }
] as const

export const APPLICATION_STEPS = [
  {
    title: 'İşletme Bilgileri',
    description: 'Şirket bilgilerini girerek başvurunu başlat.'
  },
  {
    title: 'Şube Bilgileri',
    description: 'Şubenin ad, iletişim ve diğer bilgilerini ekle.'
  },
  {
    title: 'Konum Bilgileri',
    description: 'Şubenin konum bilgilerini ekle.'
  },
  {
    title: 'Çalışma Saatleri',
    description: 'Şubenin çalışma saatlerini belirle ve başvurunu tamamla.'
  }
] as const

export const PARTNER_FEATURES = [
  {
    icon: CreditCard,
    title: 'Şuben İçin Akıllı Sipariş Çözümü',
    description: 'Şubelerine özel web sitesi ile siparişlerinizi oluşturun.',
    boxClass: 'bg-primary/10 text-primary'
  },
  {
    icon: Clock,
    title: 'Sipariş & Kurye Takip',
    description: 'Siparişlerinizi anlık görüntüleyin, kurye takibini tek ekrandan yapın.',
    boxClass: 'bg-success/10 text-success'
  },
  {
    icon: LineChart,
    title: 'Online Mutabakat & Raporlama',
    description: 'Mutabakat süreçlerinizi online yönetin, raporlarınızı anlık görüntüleyin.',
    boxClass: 'bg-info/10 text-info'
  },
  {
    icon: MessageCircle,
    title: 'Müşteri Hizmetleri Anında Yanınızda',
    description: 'Canlı destek ile 7/24 destek alın ve sorunlarınızı anında çözün.',
    boxClass: 'bg-secondary text-secondary-foreground'
  }
] as const

/** Welcome onboarding akış adımları (sıra değerleri UI ile uyumlu). */
export enum WelcomeOnboardingStep {
  Intro = 0,
  Partner = 1,
  Application = 2,
  Financial = 3
}

const WELCOME_ONBOARDING_STEP_LABELS: Record<WelcomeOnboardingStep, string> = {
  [WelcomeOnboardingStep.Intro]: 'Hoş Geldin',
  [WelcomeOnboardingStep.Partner]: 'Partner',
  [WelcomeOnboardingStep.Application]: 'Başvuru Süreci',
  [WelcomeOnboardingStep.Financial]: 'İşletme Bilgileri'
}

/** Stepper’da gösterilecek etiketler (enum sırasıyla). */
export const WELCOME_ONBOARDING_STEPPER_LABELS = [
  WELCOME_ONBOARDING_STEP_LABELS[WelcomeOnboardingStep.Intro],
  WELCOME_ONBOARDING_STEP_LABELS[WelcomeOnboardingStep.Partner],
  WELCOME_ONBOARDING_STEP_LABELS[WelcomeOnboardingStep.Application],
  WELCOME_ONBOARDING_STEP_LABELS[WelcomeOnboardingStep.Financial]
] as const
