import { Clock, CreditCard, LineChart, MessageCircle } from 'lucide-react'

export const INTRO_STATS = [
  { value: '5 dk', label: 'Ortalama başvuru süresi' },
  { value: '4', label: 'Kolay adım' },
  { value: '7 gün', label: 'Canlı destek' },
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
    description: 'Canlı destek ile sorunlarınızı anında çözün.',
    boxClass: 'bg-secondary text-secondary-foreground'
  }
] as const

/** Query ve enum sırası birebir: `?step=` değeri (ilk adım varsayılan, URL’de yok). */
export const BUSINESS_SETUP_STEP_QUERY_KEYS = [
  'intro',
  'partner-benefits',
  'application-process',
  'business-info'
] as const

/** İşletme kurulum akış adımları (sıra değerleri UI ile uyumlu). */
export enum BusinessSetupStep {
  Intro = 0,
  PartnerBenefits = 1,
  ApplicationProcess = 2,
  BusinessInfo = 3
}

const BUSINESS_SETUP_STEP_LABELS: Record<BusinessSetupStep, string> = {
  [BusinessSetupStep.Intro]: 'Hoş Geldin',
  [BusinessSetupStep.PartnerBenefits]: 'Partner',
  [BusinessSetupStep.ApplicationProcess]: 'Başvuru Süreci',
  [BusinessSetupStep.BusinessInfo]: 'İşletme Bilgileri'
}

/** Stepper’da gösterilecek etiketler (enum sırasıyla). */
export const BUSINESS_SETUP_STEPPER_LABELS = [
  BUSINESS_SETUP_STEP_LABELS[BusinessSetupStep.Intro],
  BUSINESS_SETUP_STEP_LABELS[BusinessSetupStep.PartnerBenefits],
  BUSINESS_SETUP_STEP_LABELS[BusinessSetupStep.ApplicationProcess],
  BUSINESS_SETUP_STEP_LABELS[BusinessSetupStep.BusinessInfo]
] as const
