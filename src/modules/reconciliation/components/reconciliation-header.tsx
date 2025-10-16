'use client'

import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { CheckCircle, Download } from 'lucide-react'

interface ReconciliationHeaderProps {
  onRefresh: () => void
  isLoading: boolean
}

export default function ReconciliationHeader({ onRefresh, isLoading }: ReconciliationHeaderProps) {
  return (
    <PageHeader
      title='Mutabakat'
      description='Günlük satış mutabakatlarınızı takip edin ve raporlarınızı indirin'
      icon={CheckCircle}
      iconColor='text-orange-600'
      showRefreshButton
      onRefresh={onRefresh}
      isLoading={isLoading}
      actions={
        <Button variant='outline'>
          <Download className='mr-2 h-4 w-4' />
          Rapor İndir
        </Button>
      }
    />
  )
}
