import { Alert, AlertDescription } from '@/components/ui/alert'
import { TriangleAlert } from 'lucide-react'

export default function ReconciliationInfoAlert() {
  return (
    <Alert color='warning' variant='outline'>
      <TriangleAlert className='h-4 w-4' />
      <AlertDescription className='font-medium'>
        <strong>Önemli Bilgi:</strong> Mutabakat işlemleri her gün saat 00:00'da otomatik olarak gerçekleştirilir. Ödeme
        süreci 1-2 iş günü sürebilir.
      </AlertDescription>
    </Alert>
  )
}
