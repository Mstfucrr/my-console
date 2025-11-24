import { Skeleton } from '@/components/ui/skeleton'

export function OrderDetailSkeleton() {
  return (
    <div className='space-y-6 p-6 pt-0'>
      {/* Kurye Bilgileri Skeleton */}
      <div className='bg-muted/50 flex items-center justify-between rounded-lg p-4'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-10 w-10 rounded-full max-sm:hidden' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-5 w-20 rounded-full' />
          </div>
        </div>
        <Skeleton className='h-9 w-32 rounded-md' />
      </div>

      {/* İki Kolonlu Yapı */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Sipariş Bilgileri Skeleton */}
        <div className='space-y-4 rounded-lg border p-4'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-5 w-32' />
          </div>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-48' />
            </div>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-6 w-20 rounded-full' />
            </div>
            <Skeleton className='h-px w-full' />
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-4 w-40' />
            </div>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-24' />
            </div>
            <Skeleton className='h-px w-full' />
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-32' />
            </div>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-4 w-32' />
            </div>
            <Skeleton className='h-px w-full' />
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-7 w-24' />
            </div>
          </div>
        </div>

        {/* Müşteri Bilgileri Skeleton */}
        <div className='space-y-4 rounded-lg border p-4'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-5 w-32' />
          </div>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-24' />
            </div>
            <Skeleton className='h-px w-full' />
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-32' />
            </div>
            <Skeleton className='h-px w-full' />
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-28' />
              <div className='space-y-2 text-right'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-40' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
