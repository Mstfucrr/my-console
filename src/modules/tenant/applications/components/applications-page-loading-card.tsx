'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export function ApplicationsPageLoadingCard({
  className,
  label = 'Yükleniyor...'
}: {
  className?: string
  label?: string
}) {
  return (
    <div className={cn('p-6 max-sm:p-0', className)}>
      <div className='mx-auto w-full max-w-md'>
        <Card className='border-muted-foreground/20'>
          <CardContent className='flex flex-col items-center justify-center gap-4 py-8'>
            <div className='flex flex-col items-center gap-3 text-center'>
              <div className='bg-muted rounded-full p-3'>
                <Loader2 className='text-primary size-8 animate-spin' />
              </div>
              <p className='text-muted-foreground text-sm'>{label}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
