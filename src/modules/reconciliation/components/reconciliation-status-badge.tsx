import { Badge } from '@/components/ui/badge'
import { STATUS_COLORS, STATUS_TEXT } from '../constants'
import { ReconciliationStatusType } from '../types'

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
