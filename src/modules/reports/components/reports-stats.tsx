import StatCard from '@/components/StatCard'
import { StatCardIcons } from '@/constants/icons'
import { TrendingUp } from 'lucide-react'
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
      Icon: StatCardIcons.TotalOrders,
      color: 'text-blue-600',
      type: 'number' as const
    },
    {
      title: 'Toplam Gelir',
      value: stats.totalRevenue,
      Icon: StatCardIcons.TotalRevenue,
      color: 'text-green-600',
      type: 'currency' as const
    },
    {
      title: 'Platform Komisyonu',
      value: stats.totalFees,
      Icon: TrendingUp,
      color: 'text-orange-600',
      type: 'currency' as const
    },
    {
      title: 'Net Gelir',
      value: stats.netRevenue,
      Icon: StatCardIcons.NetRevenue,
      color: 'text-purple-600',
      type: 'currency' as const
    }
  ]

  return (
    <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} isLoading={isLoading} />
      ))}
    </div>
  )
}
