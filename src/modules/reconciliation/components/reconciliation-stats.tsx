import StatCard from '@/components/StatCard'
import { AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react'

interface ReconciliationStats {
  totalSettled: number
  totalPending: number
  totalFailed: number
  monthlyRevenue: number
  platformFees: number
  netRevenue: number
}

interface ReconciliationStatsProps {
  stats: ReconciliationStats
}

export default function ReconciliationStats({ stats }: ReconciliationStatsProps) {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <StatCard
        title='Ödenen Tutar'
        value={stats.totalSettled}
        Icon={CheckCircle}
        hint='Bu ay ödenen toplam'
        color='text-green-600'
      />

      <StatCard
        title='Bekleyen Ödeme'
        value={stats.totalPending}
        Icon={Clock}
        hint='Ödeme bekleyen tutar'
        color='text-yellow-600'
      />

      <StatCard
        title='Başarısız Ödeme'
        value={stats.totalFailed}
        Icon={AlertTriangle}
        hint='Sorunlu ödemeler'
        color='text-red-600'
      />

      <StatCard
        title='Net Ciro'
        value={stats.netRevenue}
        Icon={DollarSign}
        hint='Komisyon sonrası net'
        color='text-purple-600'
        type='currency'
      />
    </div>
  )
}
