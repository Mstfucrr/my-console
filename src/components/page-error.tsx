import { Alert, AlertDescription } from '@/components/ui/alert'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { AlertTriangle } from 'lucide-react'

interface PageErrorProps {
  errorMessage: string
  onRefresh: () => void
}

export default function PageError({ errorMessage, onRefresh }: PageErrorProps) {
  return (
    <Alert color='destructive' variant='outline' className='mt-5 w-fit items-baseline'>
      <AlertTriangle />
      <AlertDescription className='flex items-center justify-between gap-5'>
        <span>{errorMessage}</span>
        <RefreshButton size='xs' onClick={onRefresh} />
      </AlertDescription>
    </Alert>
  )
}
