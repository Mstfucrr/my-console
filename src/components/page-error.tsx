import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'

interface PageErrorProps {
  errorMessage?: string
  onRefresh: () => void
  isLoading?: boolean
  title?: string
  description?: string
  className?: string
  fullPage?: boolean
}

export default function PageError({
  errorMessage,
  onRefresh,
  isLoading = false,
  title,
  description,
  className,
  fullPage = false
}: PageErrorProps) {
  const displayTitle = title || 'Bir hata oluştu'
  const displayDescription =
    description || errorMessage || 'Veriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'

  const content = (
    <Card className={cn('border-destructive/50', className)}>
      <CardContent className='flex flex-col items-center justify-center gap-4 py-12'>
        <div className='flex flex-col items-center gap-3 text-center'>
          <div className='bg-destructive/10 rounded-full p-3'>
            <AlertTriangle className='text-destructive size-8' />
          </div>
          <div className='space-y-1'>
            <h3 className='text-foreground text-lg font-semibold'>{displayTitle}</h3>
            <p className='text-muted-foreground text-sm'>{displayDescription}</p>
          </div>
        </div>
        <RefreshButton onClick={onRefresh} isLoading={isLoading} />
      </CardContent>
    </Card>
  )

  if (fullPage) {
    return (
      <div className='flex min-h-[calc(100vh-200px)] items-center justify-center p-6'>
        <div className='w-full max-w-md'>{content}</div>
      </div>
    )
  }

  return <div className='p-6 max-sm:p-0'>{content}</div>
}
