'use client'

import StatCard from '@/components/StatCard'
import { OrderStatusLabel } from '@/modules/types'
import { CheckCircle2, Clock, LucideIcon, ShoppingCart, Truck, XCircle } from 'lucide-react'
import { useMemo } from 'react'
import { OrdersContextType, useOrders } from '../../context/OrdersContext'

interface Stat {
  title: string
  id: keyof OrdersContextType['stats']
  Icon: LucideIcon
  hint: string
  color: string
  value: number
}

const statsList: Array<Stat> = [
  {
    title: 'Toplam',
    id: 'total',
    Icon: ShoppingCart,
    hint: 'Toplam sipariş sayısı',
    color: 'text-blue-600',
    value: 0
  },
  {
    title: OrderStatusLabel.created,
    id: 'created',
    Icon: Clock,
    hint: 'Beklemede olan siparişler',
    color: 'text-orange-500',
    value: 0
  },
  {
    title: OrderStatusLabel.shipped,
    id: 'shipped',
    Icon: CheckCircle2,
    hint: 'Yola Çıkan siparişler',
    color: 'text-green-600',
    value: 0
  },
  {
    title: OrderStatusLabel.delivered,
    id: 'delivered',
    Icon: Truck,
    hint: 'Teslim Edilen siparişler',
    color: 'text-red-500',
    value: 0
  },
  {
    title: OrderStatusLabel.cancelled,
    id: 'cancelled',
    Icon: XCircle,
    hint: 'İptal edilen siparişler',
    color: 'text-red-600',
    value: 0
  }
]

export function OrdersStats() {
  const { stats: statsData, isStatsLoading } = useOrders()

  const stats = useMemo(() => statsList.map(stat => ({ ...stat, value: statsData[stat.id] || 0 })), [statsData])

  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5'>
      {stats.map(stat => (
        <StatCard {...stat} key={stat.id} className='size-full' isLoading={isStatsLoading} />
      ))}
    </div>
  )
}
