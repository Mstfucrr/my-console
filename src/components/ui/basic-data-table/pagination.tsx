'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type DataTablePaginationProps = {
  page: number
  totalPages: number
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
  onPageClick?: (page: number) => void
  pageButtons?: number[]
  leftInfo?: string
  className?: string
}

export function DataTablePagination({
  page,
  totalPages,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onPageClick,
  pageButtons,
  leftInfo,
  className
}: DataTablePaginationProps) {
  // örneğin 5. sayfadaysa şu şekilde gösterilecek:
  // 1 ... 4 5 6 ... 10
  const visiblePageButtons: (number | '...')[] = []
  if (page > 3) {
    visiblePageButtons.push(1)
    visiblePageButtons.push('...')
  }
  for (let i = page - 2; i <= page + 2; i++) {
    if (i > 0 && i <= totalPages) {
      visiblePageButtons.push(i)
    }
  }
  if (page < totalPages - 2) {
    visiblePageButtons.push('...')
    visiblePageButtons.push(totalPages)
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-4 px-2 py-2 sm:px-0', className)}>
      <div className='text-muted-foreground flex-1 text-xs whitespace-nowrap sm:text-sm'>{leftInfo}</div>

      <div className='flex items-center gap-2'>
        <Button variant='outline' size='icon' onClick={onPrev} disabled={!canPrev} className='h-8 w-8'>
          <ChevronLeft className='h-4 w-4' />
        </Button>

        {visiblePageButtons.map(p => (
          <Button
            key={`dt-page-${p}`}
            onClick={() => onPageClick?.(p as number)}
            variant={p === page ? 'soft' : 'ghost'}
            className={cn('h-8 w-8 px-0')}
            disabled={p === '...'}
          >
            {p}
          </Button>
        ))}

        <Button variant='outline' size='icon' onClick={onNext} disabled={!canNext} className='h-8 w-8'>
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
