'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
export type PaginationProps = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  className?: string
  onPageSizeChange?: (size: number) => void
}

export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange, className }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const canPrev = page > 1
  const canNext = page < totalPages

  const handlePrev = () => {
    if (canPrev) {
      onPageChange(page - 1)
    }
  }

  const handleNext = () => {
    if (canNext) {
      onPageChange(page + 1)
    }
  }

  const handlePageClick = (targetPage: number) => {
    if (targetPage !== page && targetPage > 0 && targetPage <= totalPages) {
      onPageChange(targetPage)
    }
  }

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0
  const endItem = Math.min(page * pageSize, total)
  const leftInfo = `${startItem}-${endItem} / ${total}`

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
    <div className={cn('flex flex-wrap items-center gap-2 px-2 py-2 sm:px-0', className)}>
      <div className='text-muted-foreground flex-1 text-xs whitespace-nowrap sm:text-sm'>{leftInfo}</div>

      <div className='flex items-center gap-1'>
        {onPageSizeChange && (
          <Select value={pageSize.toString()} onValueChange={value => onPageSizeChange?.(Number(value))}>
            <SelectTrigger size='sm'>
              <SelectValue placeholder='Sayfa boyutu' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='50'>50</SelectItem>
              <SelectItem value='100'>100</SelectItem>
            </SelectContent>
          </Select>
        )}

        <div className='flex flex-1 items-center gap-1'>
          <Button variant='outline' className='size-7 p-0' onClick={handlePrev} disabled={!canPrev}>
            <ChevronLeft className='h-4 w-4' />
          </Button>

          {visiblePageButtons.map(p => (
            <Button
              key={`dt-page-${p}`}
              className='size-7 p-0'
              onClick={() => handlePageClick(p as number)}
              variant={p === page ? undefined : p === '...' ? 'ghost' : 'outline'}
              disabled={p === '...' || p === page}
            >
              {p}
            </Button>
          ))}

          <Button variant='outline' className='size-7 p-0' onClick={handleNext} disabled={!canNext}>
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
