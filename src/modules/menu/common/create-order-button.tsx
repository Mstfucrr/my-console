import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-media-query'
import { usePermission } from '@/hooks/use-permission'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export function CreateOrderButton() {
  const isMobile = useIsMobile()
  const { canCreateOrder } = usePermission()

  if (!canCreateOrder) return null

  return (
    <Link href='/orders/create'>
      <Button className='font-extrabold' color='success' size={!isMobile ? 'xs' : 'icon-sm'}>
        <Plus className='size-5' />
        <span className='ml-2 max-md:sr-only'>Yeni Sipariş</span>
      </Button>
    </Link>
  )
}
