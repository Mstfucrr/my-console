import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { Skeleton } from './ui/skeleton'

interface MapLoadingProps {
  className?: string
  skeletonClassName?: string
}

export default function MapLoading({ className, skeletonClassName }: MapLoadingProps) {
  return (
    <div className={cn('flex w-full items-start justify-center', className)}>
      <Skeleton className={cn('flex size-full items-center justify-center', skeletonClassName)}>
        <Loader2 className='mr-2 size-10 animate-spin' />
        <span className='text-md'>Harita yükleniyor...</span>
      </Skeleton>
    </div>
  )
}
