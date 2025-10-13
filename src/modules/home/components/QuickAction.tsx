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
  subtitle,
  color
}: {
  href?: Route
  onClick?: () => void
  Icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
  color?: string
}) {
  return (
    <QuickActionLink href={href} onClick={onClick}>
      <Card className='hover:bg-accent group transition-colors'>
        <CardContent className='p-4 max-sm:p-2'>
          <div className='flex h-28 flex-col items-center justify-center text-center'>
            <Icon className={cn('mb-2 size-8 max-sm:size-6', color)} />
            <div className='mb-1 font-medium max-sm:text-xs'>{title}</div>
            <div className='text-muted-foreground text-xs max-sm:text-[9px]'>{subtitle}</div>
          </div>
        </CardContent>
      </Card>
    </QuickActionLink>
  )
}
