import { Skeleton } from '@/components/ui/skeleton'

// OrderCardSkeleton resimdeki kart skeleton'una yaklaştırıldı
export function OrderCardSkeleton() {
  return (
    <div className='bg-background flex min-h-[86px] w-full flex-col gap-4 rounded-xl border px-4 py-3 shadow-sm'>
      {/* Üst satır: solda icon ve isim, sağda tutar */}
      <div className='flex items-center justify-between gap-2'>
        {/* Sol kısım: icon + isim */}
        <div className='flex min-w-0 items-center gap-2'>
          <Skeleton className='h-5 w-5 rounded-full' />
          <Skeleton className='h-4 w-24 rounded' />
          <Skeleton className='ml-2 h-4 w-5 rounded' /> {/* göz ikon skeleton */}
        </div>
        {/* Sağ: tutar */}
        <Skeleton className='h-7 w-24 rounded' />
      </div>
      {/* Saat ve etiket/rozetler */}
      <div className='flex items-center justify-between gap-2'>
        {/* Saat */}
        <Skeleton className='h-4 w-12 rounded' />
        {/* Rozetler */}
        <div className='flex gap-2'>
          <Skeleton className='h-6 w-16 rounded-full' /> {/* İptal Edildi */}
          <Skeleton className='h-6 w-32 rounded-full' /> {/* Kredi Kartı */}
        </div>
      </div>
    </div>
  )
}
