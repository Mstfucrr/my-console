import { Badge } from '@/components/ui/badge'
import { ReconciliationStatusType, STATUS_COLORS, STATUS_TEXT } from '../types'

interface ReconciliationStatusBadgeProps {
  status: ReconciliationStatusType
}

export default function ReconciliationStatusBadge({ status }: ReconciliationStatusBadgeProps) {
  return (
    <Badge variant='outline' color={STATUS_COLORS[status] || 'secondary'}>
      {STATUS_TEXT[status]}
    </Badge>
  )
}
