import StatCard from '@/components/StatCard'
import { Calculator, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react'
import type { ReportsStats } from '../types'

interface ReportsStatsProps {
  stats: ReportsStats
  isLoading: boolean
}

export default function ReportsStats({ stats, isLoading }: ReportsStatsProps) {
  const statCards = [
    {
      title: 'Toplam Sipariş',
      value: stats.totalOrders,
      Icon: ShoppingCart,
      color: 'text-blue-600',
      hint: 'Tüm zamanlar',
      type: 'number' as const
    },
    {
      title: 'Toplam Gelir',
      value: stats.totalRevenue,
      Icon: DollarSign,
      color: 'text-green-600',
      hint: 'Brüt gelir',
      type: 'currency' as const
    },
    {
      title: 'Platform Komisyonu',
      value: stats.totalFees,
      Icon: TrendingUp,
      color: 'text-orange-600',
      hint: 'Toplam komisyon',
      type: 'currency' as const
    },
    {
      title: 'Net Gelir',
      value: stats.netRevenue,
      Icon: Calculator,
      color: 'text-purple-600',
      hint: 'Komisyon sonrası',
      type: 'currency' as const
    }
  ]

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} isLoading={isLoading} />
      ))}
    </div>
  )
}
