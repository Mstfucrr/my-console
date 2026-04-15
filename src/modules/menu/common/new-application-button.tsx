import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-media-query'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export function NewApplicationButton() {
  const isMobile = useIsMobile()

  return (
    <Link href='/applications/new'>
      <Button className='font-extrabold' color='success' size={!isMobile ? 'xs' : 'icon-sm'}>
        <Plus className='size-5' />
        <span className='ml-2 max-md:sr-only'>Şube Başvurusu</span>
      </Button>
    </Link>
  )
}
