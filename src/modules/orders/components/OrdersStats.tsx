'use client'

import StatCard from '@/components/StatCard'
import { OrderStatus } from '@/modules/types'
import { CheckCircle2, Clock, Flame, LucideIcon, ShoppingCart, Truck, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { OrdersContextType, useOrders } from '../context/OrdersContext'

interface Stat {
  title: string
  id: keyof OrdersContextType['stats']
  Icon: LucideIcon
  hint: string
  color: string
  value: number
  orderStatus?: OrderStatus
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
    title: 'Beklemede',
    id: 'pending',
    Icon: Clock,
    hint: 'Beklemede olan siparişler',
    color: 'text-orange-500',
    value: 0,
    orderStatus: 'pending'
  },
  {
    title: 'Hazırlanıyor',
    id: 'preparing',
    Icon: Flame,
    hint: 'Hazırlanan siparişler',
    color: 'text-blue-600',
    value: 0,
    orderStatus: 'preparing'
  },
  {
    title: 'Hazırlandı',
    id: 'prepared',
    Icon: CheckCircle2,
    hint: 'Hazırlanan siparişler',
    color: 'text-cyan-600',
    value: 0,
    orderStatus: 'prepared'
  },
  {
    title: 'Hazır',
    id: 'ready',
    Icon: CheckCircle2,
    hint: 'Hazır olan siparişler',
    color: 'text-green-600',
    value: 0,
    orderStatus: 'ready'
  },
  {
    title: 'Yolda',
    id: 'on_way',
    Icon: Truck,
    hint: 'Yoldaki siparişler',
    color: 'text-red-500',
    value: 0,
    orderStatus: 'on_way'
  },
  {
    title: 'Teslim Edildi',
    id: 'delivered',
    Icon: CheckCircle2,
    hint: 'Teslim edilen siparişler',
    color: 'text-green-600',
    value: 0,
    orderStatus: 'delivered'
  },
  {
    title: 'İptal',
    id: 'cancelled',
    Icon: XCircle,
    hint: 'İptal edilen siparişler',
    color: 'text-red-600',
    value: 0,
    orderStatus: 'cancelled'
  }
]

export function OrdersStats() {
  const { stats: statsData, handleStatClick, clearFilter } = useOrders()

  const [stats, setStats] = useState<Stat[]>([])

  useEffect(() => {
    setStats(statsList.map(stat => ({ ...stat, value: statsData[stat.id] || 0 })))
  }, [statsData])

  const StatClick = (stat: Stat) => {
    if (stat.orderStatus) handleStatClick([stat.orderStatus])
    else clearFilter()
  }

  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-8'>
      {stats.map((stat, index) => (
        <button onClick={() => StatClick(stat)} className='size-full' key={stat.id}>
          <StatCard
            title={stat.title}
            value={stats[index].value}
            Icon={stat.Icon}
            hint={stat.hint}
            color={stat.color}
            className='size-full'
          />
        </button>
      ))}
    </div>
  )
}
