'use client'

import { PageHeader } from '@/components/page-header'
import { ModuleIcons } from '@/constants/icons'

interface ReconciliationHeaderProps {
  onRefresh: () => void
  isLoading: boolean
}

export default function ReconciliationHeader({ onRefresh, isLoading }: ReconciliationHeaderProps) {
  return (
    <PageHeader
      title='Mutabakat'
      description='Satış mutabakatlarınızı takip edin'
      icon={ModuleIcons.Reconciliation}
      iconColor='text-orange-600'
      showRefreshButton
      onRefresh={onRefresh}
      isLoading={isLoading}
    />
  )
}
