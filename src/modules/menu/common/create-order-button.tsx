import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export function CreateOrderButton() {
  return (
    <Link href='/orders/create'>
      <Button className='font-extrabold' color='success' size='xs'>
        <Plus className='size-4' />
        <span className='ml-2 max-sm:sr-only'>Sipariş Oluştur</span>
      </Button>
    </Link>
  )
}
