import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/** Kategori / marka satırı için sidebar satır görünümü */
export function B2BSidebarRowSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 rounded-lg px-3 py-2.5', className)}>
      <Skeleton className='size-4 shrink-0 rounded-sm' />
      <Skeleton className='h-4 min-w-0 flex-1 rounded-md' />
      <Skeleton className='h-4 w-8 shrink-0 rounded-md' />
    </div>
  )
}

/** Arama kutusu yerine tek çubuk */
export function B2BSidebarSearchSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn('h-8 w-full rounded-md', className)} />
}

type B2BSidebarSectionSkeletonProps = {
  title: string
  rowCount?: number
  showClearRow?: boolean
  className?: string
}

export function B2BSidebarSectionSkeleton({
  title,
  rowCount = 6,
  showClearRow = true,
  className
}: B2BSidebarSectionSkeletonProps) {
  return (
    <div className={cn('space-y-2.5', className)}>
      <p className='text-muted-foreground px-1 text-xs font-semibold tracking-wide uppercase'>{title}</p>
      <B2BSidebarSearchSkeleton />
      <div className='flex max-h-[400px] flex-col gap-0.5 overflow-y-auto pr-1'>
        {showClearRow ? (
          <div className='flex items-center gap-2 rounded-lg px-3 py-2.5'>
            <Skeleton className='h-4 min-w-0 flex-1 rounded-md' />
            <Skeleton className='h-4 w-10 shrink-0 rounded-md' />
          </div>
        ) : null}
        {Array.from({ length: rowCount }).map((_, i) => (
          <B2BSidebarRowSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

/** Ürün kartına yaklaşık düzen */
export function B2BProductCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('border-border/70 overflow-hidden rounded-2xl', className)}>
      <Skeleton className='h-32 rounded-none rounded-t-2xl sm:h-40' />
      <CardContent className='flex min-h-36 flex-col justify-between gap-3 p-3'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-[85%] rounded-md' />
          <Skeleton className='h-3 w-1/2 rounded-md' />
          <Skeleton className='h-3 w-2/3 rounded-md' />
        </div>
        <div className='flex items-end justify-between gap-2 pt-1'>
          <Skeleton className='h-7 w-24 rounded-md' />
          <Skeleton className='h-9 w-[5.5rem] rounded-md' />
        </div>
      </CardContent>
    </Card>
  )
}

type B2BProductGridSkeletonProps = {
  gridClassName: string
  count?: number
  className?: string
}

export function B2BProductGridSkeleton({ gridClassName, count = 8, className }: B2BProductGridSkeletonProps) {
  return (
    <div className={cn('grid gap-4', gridClassName, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <B2BProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

/** Sipariş özeti kartı */
export function B2BOrderCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('border-border/70 overflow-hidden', className)}>
      <CardContent className='space-y-4 pt-4'>
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0 space-y-2'>
            <Skeleton className='h-3 w-14 rounded-md' />
            <Skeleton className='h-4 w-36 max-w-full rounded-md' />
          </div>
          <Skeleton className='h-6 w-14 shrink-0 rounded-full' />
        </div>
        <div className='bg-secondary/30 border-border/50 grid grid-cols-2 gap-3 rounded-xl border p-3'>
          <div className='space-y-2'>
            <Skeleton className='h-3 w-12 rounded-md' />
            <Skeleton className='h-5 w-24 rounded-md' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-3 w-10 rounded-md' />
            <Skeleton className='h-5 w-full rounded-md' />
          </div>
        </div>
        <div className='flex items-center justify-between gap-2'>
          <Skeleton className='h-4 w-24 rounded-md' />
          <Skeleton className='h-4 w-16 rounded-md' />
        </div>
      </CardContent>
    </Card>
  )
}

type B2BOrdersGridSkeletonProps = {
  count?: number
  className?: string
}

export function B2BOrdersGridSkeleton({ count = 6, className }: B2BOrdersGridSkeletonProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <B2BOrderCardSkeleton key={i} />
      ))}
    </div>
  )
}

/** Ödeme kutusu — dialog / sonuç ekranı */
export function B2BPaymentBlockSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      <Skeleton className='h-4 w-full rounded-md' />
      <Skeleton className='h-4 w-[90%] rounded-md' />
      <Skeleton className='h-4 w-[80%] rounded-md' />
    </div>
  )
}

/** Sipariş detay diyaloğu içi */
export function B2BOrderDetailSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Card className='border-border/70'>
          <CardContent className='space-y-3 pt-4'>
            <Skeleton className='h-4 w-full rounded-md' />
            <Skeleton className='h-4 w-full rounded-md' />
            <Skeleton className='h-4 w-[80%] rounded-md' />
            <Skeleton className='h-4 w-1/2 rounded-md' />
          </CardContent>
        </Card>
        <Card className='border-border/70'>
          <CardHeader className='pb-2'>
            <Skeleton className='h-5 w-40 rounded-md' />
          </CardHeader>
          <CardContent>
            <B2BPaymentBlockSkeleton />
          </CardContent>
        </Card>
      </div>
      <Card className='border-border/70'>
        <CardHeader className='pb-2'>
          <Skeleton className='h-5 w-28 rounded-md' />
        </CardHeader>
        <CardContent className='space-y-2'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className='bg-secondary/25 border-border/60 flex items-start justify-between gap-3 rounded-lg border p-3'
            >
              <div className='min-w-0 flex-1 space-y-2'>
                <Skeleton className='h-4 w-[70%] rounded-md' />
                <Skeleton className='h-3 w-1/3 rounded-md' />
                <Skeleton className='h-3 w-24 rounded-md' />
              </div>
              <Skeleton className='h-5 w-16 shrink-0 rounded-md' />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
