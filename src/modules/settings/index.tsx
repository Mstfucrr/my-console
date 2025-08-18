'use client'

import { PageHeader } from '@/components/page-header'
import { Settings } from 'lucide-react'
import { useState } from 'react'
import IntegrationSettingsCard from './components/integration-settings-card'
import PaymentSettingsCard from './components/payment-settings-card'
import RestaurantInfoCard from './components/restaurant-info-card'
import RestaurantStatusCard from './components/restaurant-status-card'
import WorkingAreaSettingsCard from './components/working-area-settings-card'
import WorkingHoursCard from './components/working-hours-card'
import WorkingStyleCard from './components/working-style-card'

interface Integration {
  id: string
  name: string
  icon: string
  isActive: boolean
  webhookUrl?: string
  apiKey?: string
  orderCount: number
}

interface WorkingArea {
  id: string
  name: string
  type: 'polygon' | 'neighborhood'
  coordinates?: number[][]
  neighborhoods?: string[]
  isActive: boolean
}

interface PaymentType {
  id: string
  name: string
  type: 'cash' | 'card' | 'online'
  isActive: boolean
  terminalId?: string
  commissionRate?: number
}

interface WorkingHour {
  day: string
  isOpen: boolean
  openTime: string | null
  closeTime: string | null
}

interface RestaurantInfo {
  iban: string
  taxNumber: string
  title: string
  address: string
  phone: string
  email: string
}

export default function SettingsView() {
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true)

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Yemeksepeti',
      icon: '🥘',
      isActive: true,
      webhookUrl: 'https://api.example.com/webhook/ys',
      apiKey: 'ys_****',
      orderCount: 234
    },
    {
      id: '2',
      name: 'Getir',
      icon: '⚡',
      isActive: true,
      webhookUrl: 'https://api.example.com/webhook/getir',
      apiKey: 'gt_****',
      orderCount: 156
    },
    { id: '3', name: 'Trendyol Go', icon: '🛒', isActive: false, webhookUrl: '', apiKey: '', orderCount: 0 },
    { id: '4', name: 'Migros Yemek', icon: '🛍️', isActive: false, webhookUrl: '', apiKey: '', orderCount: 0 }
  ])

  const [workingAreas, setWorkingAreas] = useState<WorkingArea[]>([
    {
      id: '1',
      name: 'Kadıköy Merkez',
      type: 'neighborhood',
      neighborhoods: ['Caferağa', 'Fenerbahçe', 'Göztepe'],
      isActive: true
    },
    { id: '2', name: 'Bağdat Caddesi Çevresi', type: 'polygon', coordinates: [], isActive: true }
  ])

  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([
    { id: '1', name: 'Nakit', type: 'cash', isActive: true },
    { id: '2', name: 'Kredi Kartı', type: 'card', isActive: true, terminalId: 'TRM001', commissionRate: 2.5 },
    { id: '3', name: 'Yemek Kartı', type: 'card', isActive: false, terminalId: '', commissionRate: 3.0 }
  ])

  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([
    { day: 'Pazartesi', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    { day: 'Salı', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    { day: 'Çarşamba', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    { day: 'Perşembe', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    { day: 'Cuma', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    { day: 'Cumartesi', isOpen: true, openTime: '10:00', closeTime: '23:00' },
    { day: 'Pazar', isOpen: false, openTime: null, closeTime: null }
  ])

  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    iban: 'TR12 3456 7890 1234 5678 90',
    taxNumber: '1234567890',
    title: 'Lezzet Durağı Restaurant',
    address: 'Kadıköy Mah. Bağdat Cad. No:123 İstanbul',
    phone: '+90 216 123 45 67',
    email: 'info@lezzetduragi.com'
  })

  const [workingStyle, setWorkingStyle] = useState<'kontor' | 'unlimited'>('kontor')

  // Event handlers
  const handleStatusChange = (isOpen: boolean, duration?: string) => {
    setIsRestaurantOpen(isOpen)
    if (!isOpen && duration) {
      console.log(`Restaurant kapatıldı: ${duration}`)
      // TODO: Set timer based on duration
    }
  }

  const handleIntegrationUpdate = (id: string, data: Partial<Integration>) => {
    setIntegrations(prev => prev.map(item => (item.id === id ? { ...item, ...data } : item)))
  }

  const handleWorkingAreaUpdate = (id: string, data: Partial<WorkingArea>) => {
    setWorkingAreas(prev => prev.map(item => (item.id === id ? { ...item, ...data } : item)))
  }

  const handlePaymentTypeUpdate = (id: string, data: Partial<PaymentType>) => {
    setPaymentTypes(prev => prev.map(item => (item.id === id ? { ...item, ...data } : item)))
  }

  const handleWorkingHoursUpdate = (hours: WorkingHour[]) => {
    setWorkingHours(hours)
  }

  const handleRestaurantInfoUpdate = (info: RestaurantInfo) => {
    setRestaurantInfo(info)
  }

  const handleWorkingStyleChange = (style: 'kontor' | 'unlimited') => {
    setWorkingStyle(style)
  }

  return (
    <div className='flex flex-col gap-6 p-6'>
      {/* Page Header */}
      <PageHeader
        title='Restoran Ayarları'
        description='Restoranınızın tüm operasyonel ayarlarını buradan yönetebilirsiniz'
        icon={Settings}
        iconColor='text-yellow-500'
      />

      {/* Restaurant Status */}
      <RestaurantStatusCard isOpen={isRestaurantOpen} onStatusChange={handleStatusChange} />

      {/* Main Settings Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <IntegrationSettingsCard integrations={integrations} onIntegrationUpdate={handleIntegrationUpdate} />

        <WorkingAreaSettingsCard workingAreas={workingAreas} onWorkingAreaUpdate={handleWorkingAreaUpdate} />

        <PaymentSettingsCard paymentTypes={paymentTypes} onPaymentTypeUpdate={handlePaymentTypeUpdate} />

        <WorkingHoursCard workingHours={workingHours} onWorkingHoursUpdate={handleWorkingHoursUpdate} />
      </div>

      {/* Bottom Section - Restaurant Info and Working Style */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <RestaurantInfoCard restaurantInfo={restaurantInfo} onRestaurantInfoUpdate={handleRestaurantInfoUpdate} />

        <WorkingStyleCard workingStyle={workingStyle} onWorkingStyleChange={handleWorkingStyleChange} />
      </div>
    </div>
  )
}
