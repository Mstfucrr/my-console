import StatCard from '@/components/StatCard'
import { StatCardIcons } from '@/constants/icons'

interface ReconciliationStats {
  totalPending: number
  totalApproved: number
  totalFailed: number
  monthlyRevenue: number
  platformFees: number
  netRevenue: number
}

interface ReconciliationStatsProps {
  stats: ReconciliationStats
  isLoading: boolean
}

export default function ReconciliationStats({ stats, isLoading }: ReconciliationStatsProps) {
  const statCards = [
    {
      title: 'Ödenen Tutar',
      value: stats.totalApproved,
      Icon: StatCardIcons.Approved,
      color: 'text-green-600',
      type: 'currency' as const
    },
    {
      title: 'Bekleyen Ödeme',
      value: stats.totalPending,
      Icon: StatCardIcons.Pending,
      color: 'text-yellow-600',
      type: 'currency' as const
    },
    {
      title: 'Toplam Ciro',
      value: stats.netRevenue,
      Icon: StatCardIcons.TotalRevenue,
      color: 'text-purple-600',
      type: 'currency' as const
    }
  ]
  return (
    <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
      {statCards.map(stat => (
        <StatCard key={stat.title} {...stat} isLoading={isLoading} />
      ))}
    </div>
  )
}
