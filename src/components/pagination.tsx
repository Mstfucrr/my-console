'use client'

import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-media-query'
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

type PageItem = number | '...'

function getPageItems(current: number, totalPages: number, neighborCount: number): PageItem[] {
  if (totalPages <= 1) return [1]

  const pages = new Set<number>([1, totalPages])
  const start = Math.max(1, current - neighborCount)
  const end = Math.min(totalPages, current + neighborCount)

  for (let i = start; i <= end; i++) {
    pages.add(i)
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b)
  const result: PageItem[] = []

  for (let i = 0; i < sortedPages.length; i++) {
    if (i > 0 && sortedPages[i] - sortedPages[i - 1] > 1) {
      result.push('...')
    }
    result.push(sortedPages[i])
  }

  return result
}

// İç component: sadece page butonlarını render eder
interface PageButtonsProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  isMobile: boolean
}

function PageButtons({ page, totalPages, onPageChange, isMobile }: PageButtonsProps) {
  const neighborCount = isMobile ? 1 : 2
  const pageItems = getPageItems(page, totalPages, neighborCount)

  return (
    <>
      {pageItems.map((item, index) => {
        const isEllipsis = item === '...'
        const isCurrent = item === page

        if (isEllipsis) {
          return (
            <Button key={`ellipsis-${index}`} variant='ghost' className='-mx-2 size-7 p-0' disabled>
              ...
            </Button>
          )
        }

        return (
          <Button
            key={`page-${item}`}
            className='size-7 p-0'
            onClick={() => onPageChange(item)}
            variant={isCurrent ? undefined : 'outline'}
            disabled={isCurrent}
          >
            {item}
          </Button>
        )
      })}
    </>
  )
}

export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange, className }: PaginationProps) {
  const isMobile = useIsMobile()
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const canPrev = page > 1
  const canNext = page < totalPages

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0
  const endItem = Math.min(page * pageSize, total)
  const leftInfo = `${startItem}-${endItem} / ${total}`

  return (
    <div className={cn('flex flex-wrap items-center gap-2 px-0 py-2', className)}>
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
          <Button variant='outline' className='size-7 p-0' onClick={() => onPageChange(page - 1)} disabled={!canPrev}>
            <ChevronLeft className='h-4 w-4' />
          </Button>

          <PageButtons page={page} totalPages={totalPages} onPageChange={onPageChange} isMobile={isMobile} />

          <Button variant='outline' className='size-7 p-0' onClick={() => onPageChange(page + 1)} disabled={!canNext}>
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
