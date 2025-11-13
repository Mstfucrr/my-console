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
      icon={ModuleIcons.Reconciliation}
      showRefreshButton
      onRefresh={onRefresh}
      isLoading={isLoading}
    />
  )
}
