import { OrderChannel } from '@/modules/types'

function formatCurrencyTRY(amount: number) {
  return `${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`
}

function formatDateTR(dateString: string) {
  return new Date(dateString).toLocaleString('tr-TR')
}

const PAYMENT_METHOD_LABELS = {
  cash: 'Nakit',
  card: 'Kart',
  online: 'Online'
} as const

const PAYMENT_METHOD_COLORS = {
  cash: 'bg-green-100 text-green-800',
  card: 'bg-blue-100 text-blue-800',
  online: 'bg-purple-100 text-purple-800'
} as const

const CHANNEL_LABELS: Record<OrderChannel, string> = {
  yemeksepeti: 'Yemeksepeti',
  getir: 'Getir',
  trendyolGo: 'Trendyol Go',
  migrosYemek: 'Migros Yemek',
  tiklaGelsin: 'Tıkla Gelsin',
  araGelsin: 'Ara Gelsin',
  fiyuu: 'Fiyuu',
  manuel: 'Manuel'
} as const

const CHANNEL_COLORS: Record<OrderChannel, string> = {
  yemeksepeti: 'bg-red-100 text-red-800',
  getir: 'bg-purple-100 text-purple-800',
  trendyolGo: 'bg-orange-100 text-orange-800',
  migrosYemek: 'bg-green-100 text-green-800',
  tiklaGelsin: 'bg-blue-100 text-blue-800',
  araGelsin: 'bg-yellow-100 text-yellow-800',
  fiyuu: 'bg-pink-100 text-pink-800',
  manuel: 'bg-gray-100 text-gray-800'
} as const

const CHANNEL_IMAGES: Record<OrderChannel, string> = {
  yemeksepeti: 'yemeksepeti.png',
  getir: 'getir.png',
  trendyolGo: 'trendyol.png',
  migrosYemek: 'migros.png',
  tiklaGelsin: 'tiklagelsin.png',
  araGelsin: 'aragelsin.png',
  fiyuu: 'fiyuu.png',
  manuel: 'no-channel.png'
} as const

// Masking helpers
const maskPhone = (phone: string) => {
  // Show only first 3 and last 2 digits, mask the rest
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 5) return '*'.repeat(digits.length)
  return `${digits.slice(0, 3)}${'*'.repeat(digits.length - 5)}${digits.slice(-2)}`
}

const maskAddress = (address: string) => {
  // Show only first 8 chars, mask the rest except last 4
  if (!address) return ''
  if (address.length <= 12) return address[0] + '*'.repeat(address.length - 2) + address[address.length - 1]
  return `${address.slice(0, 8)}${'*'.repeat(6)}`
}

export {
  CHANNEL_COLORS,
  CHANNEL_IMAGES,
  CHANNEL_LABELS,
  formatCurrencyTRY,
  formatDateTR,
  maskAddress,
  maskPhone,
  PAYMENT_METHOD_COLORS,
  PAYMENT_METHOD_LABELS
}
