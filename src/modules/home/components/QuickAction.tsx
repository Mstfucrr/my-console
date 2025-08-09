import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function QuickAction({
  href,
  Icon,
  title,
  subtitle,
  color
}: {
  href: string
  Icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
  color?: string
}) {
  return (
    <Link href={href} className='block'>
      <Card className='hover:bg-accent group transition-colors'>
        <CardContent className='p-4'>
          <div className='flex h-28 flex-col items-center justify-center text-center'>
            <Icon className={cn('mb-2 h-8 w-8', color)} />
            <div className='mb-1 font-medium'>{title}</div>
            <div className='text-muted-foreground text-xs'>{subtitle}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
