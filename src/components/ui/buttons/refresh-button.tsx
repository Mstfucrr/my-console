import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { RefreshCw } from 'lucide-react'

type RefreshButtonProps = ButtonProps & {
  onClick: () => void
  isLoading?: boolean
  isIconButton?: boolean
}

export function RefreshButton({ onClick, isLoading = false, isIconButton = false, ...props }: RefreshButtonProps) {
  return (
    <Button variant='soft' color='info' onClick={onClick} disabled={isLoading} size='icon-sm' {...props}>
      <RefreshCw className={cn('size-4.5', { 'mr-2': !isIconButton }, isLoading && 'animate-spin')} />
      {!isIconButton && 'Yenile'}
    </Button>
  )
}
