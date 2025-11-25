import StatCard from '@/components/StatCard'
import { StatCardIcons } from '@/constants/icons'
import { type ReconciliationStats } from '../types'
interface ReconciliationStatsProps {
  stats?: ReconciliationStats
  isLoading: boolean
}

export default function ReconciliationStats({ stats, isLoading }: ReconciliationStatsProps) {
  const statCards = [
    {
      title: 'Ödenen Tutar',
      value: stats?.paidAmount || 0,
      Icon: StatCardIcons.Approved,
      color: 'text-green-600',
      type: 'currency' as const
    },
    {
      title: 'Bekleyen Ödeme',
      value: stats?.pendingPayment || 0,
      Icon: StatCardIcons.Pending,
      color: 'text-yellow-600',
      type: 'currency' as const
    },
    {
      title: 'Toplam Ciro',
      value: stats?.totalTurnover || 0,
      Icon: StatCardIcons.TotalRevenue,
      color: 'text-purple-600',
      type: 'currency' as const
    }
  ]
  if (!stats && !isLoading) return null
  return (
    <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
      {statCards.map(stat => (
        <StatCard key={stat.title} {...stat} isLoading={isLoading} />
      ))}
    </div>
  )
}
