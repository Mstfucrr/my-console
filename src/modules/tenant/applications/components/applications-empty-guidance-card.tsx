'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ClipboardList, Store } from 'lucide-react'
import Link from 'next/link'

type ApplicationsEmptyGuidanceVariant = 'resume-application' | 'new-store-branch'

const VARIANT_CONFIG: Record<
  ApplicationsEmptyGuidanceVariant,
  { title: string; description: string; buttonLabel: string; Icon: typeof ClipboardList }
> = {
  'resume-application': {
    title: 'Başvurunuza devam edin',
    description: 'Başvurunuz yarım kaldı. Tamamlamak için son 3 adım.',
    buttonLabel: 'Kaldığın Yerden Devam Et',
    Icon: ClipboardList
  },
  'new-store-branch': {
    title: 'Yeni şube',
    description: 'Yeni bir şube açmak için hemen başlayın.',
    buttonLabel: 'Şube Başvurusu Yap',
    Icon: Store
  }
}

export function ApplicationsEmptyGuidanceCard({
  variant,
  className
}: {
  variant: ApplicationsEmptyGuidanceVariant
  className?: string
}) {
  const { title, description, buttonLabel, Icon } = VARIANT_CONFIG[variant]

  return (
    <div className={cn('p-6 max-sm:p-0', className)}>
      <div className='mx-auto w-full max-w-md'>
        <Card className='border-muted-foreground/20'>
          <CardContent className='flex flex-col items-center justify-center gap-4 py-8'>
            <div className='flex flex-col items-center gap-3 text-center'>
              <div className='bg-primary/10 rounded-full p-3'>
                <Icon className='text-primary size-8' />
              </div>
              <div className='space-y-1'>
                <h3 className='text-foreground text-lg font-semibold'>{title}</h3>
                <p className='text-muted-foreground text-sm'>{description}</p>
              </div>
            </div>
            <Button color='success' asChild size='sm'>
              <Link href='/applications/new'>{buttonLabel}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
