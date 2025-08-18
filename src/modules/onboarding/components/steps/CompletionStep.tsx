import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CompletionStep() {
  const router = useRouter()

  const handleComplete = () => {
    router.push('/')
  }

  return (
    <div className='space-y-6'>
      <Card className='p-8 text-center'>
        <CheckCircle className='text-success mx-auto mb-4 h-16 w-16' />
        <h3 className='text-foreground mb-2 text-2xl font-semibold'>Tebrikler! Onboarding Tamamlandı</h3>
        <p className='text-muted-foreground mb-6'>
          Hesabınız başarıyla oluşturuldu. Artık Fiyuu Portal'ı kullanmaya başlayabilirsiniz.
        </p>

        <Button onClick={handleComplete} className='font-semibold' color='primary' size='lg'>
          Dashboard'a Git
        </Button>
      </Card>
    </div>
  )
}
