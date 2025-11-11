import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Route } from 'next'

function QuickActionLink({
  href,
  onClick,
  children
}: {
  href?: Route
  onClick?: () => void
  children: React.ReactNode
}) {
  if (href)
    return (
      <Link href={href} onClick={onClick}>
        {children}
      </Link>
    )

  return (
    <div className='block cursor-pointer' onClick={onClick}>
      {children}
    </div>
  )
}

export default function QuickAction({
  href,
  onClick,
  Icon,
  title,
  color
}: {
  href?: Route
  onClick?: () => void
  Icon: React.ComponentType<{ className?: string }>
  title: string
  color?: string
}) {
  return (
    <QuickActionLink href={href} onClick={onClick}>
      <Card className='group hover:bg-accent/30 border-0 bg-transparent transition-all duration-200 hover:shadow-sm'>
        <CardContent className='p-3 py-4'>
          <div className='relative flex h-full items-center justify-center gap-3'>
            <Icon className={cn('absolute right-10 size-12 opacity-30 max-sm:size-8', color)} />
            <div className='flex flex-1 flex-col text-left'>
              <h5 className='text-base leading-tight font-medium'>{title}</h5>
            </div>
          </div>
        </CardContent>
      </Card>
    </QuickActionLink>
  )
}
