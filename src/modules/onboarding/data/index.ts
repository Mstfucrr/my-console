import { Building2, CheckCircle, CreditCard, MapPin, Users } from 'lucide-react'
import type { OnboardingStep } from '../types'

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'company',
    title: 'Şirket Bilgileri',
    description: 'Şirketiniz hakkında temel bilgileri girin',
    icon: Building2
  },
  {
    id: 'address',
    title: 'Adres Bilgileri',
    description: 'Şirketinizin adres bilgilerini girin',
    icon: MapPin
  },
  {
    id: 'contact',
    title: 'İletişim Bilgileri',
    description: 'İletişim bilgilerinizi girin',
    icon: Users
  },
  {
    id: 'bank',
    title: 'Banka Bilgileri',
    description: 'Ödeme işlemleri için banka bilgilerinizi girin',
    icon: CreditCard
  },
  {
    id: 'completion',
    title: 'Tamamlandı',
    description: 'Onboarding süreciniz başarıyla tamamlandı',
    icon: CheckCircle
  }
]

// İller ve ilçeler (örnek veri)
export const cityDistricts: { [key: string]: string[] } = {
  İstanbul: ['Kadıköy', 'Beşiktaş', 'Üsküdar', 'Şişli', 'Beyoğlu', 'Fatih', 'Bakırköy'],
  Ankara: ['Çankaya', 'Keçiören', 'Mamak', 'Sincan', 'Yenimahalle', 'Altındağ'],
  İzmir: ['Konak', 'Karşıyaka', 'Bornova', 'Buca', 'Bayraklı', 'Gaziemir']
}

// Banka listesi
export const banks = [
  { value: 'garanti', label: 'Garanti BBVA' },
  { value: 'isbank', label: 'İş Bankası' },
  { value: 'akbank', label: 'Akbank' },
  { value: 'yapikredi', label: 'Yapı Kredi' },
  { value: 'ziraat', label: 'Ziraat Bankası' },
  { value: 'halkbank', label: 'Halkbank' },
  { value: 'vakifbank', label: 'VakıfBank' },
  { value: 'qnb', label: 'QNB Finansbank' },
  { value: 'teb', label: 'TEB' },
  { value: 'denizbank', label: 'DenizBank' }
]

// Şirket türleri
export const companyTypes = [
  { value: 'ltd', label: 'Limited Şirket' },
  { value: 'anonim', label: 'Anonim Şirket' },
  { value: 'kolektif', label: 'Kolektif Şirket' },
  { value: 'sahis', label: 'Şahıs Şirketi' },
  { value: 'kooperatif', label: 'Kooperatif' }
]
