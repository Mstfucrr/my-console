import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type MenuItem } from '../type'
import { isLocationMatch } from '../utils'

type MenuItemProps = {
  item: MenuItem
}

export function MenuItem({ item }: MenuItemProps) {
  const pathname = usePathname()
  const isActive = isLocationMatch(item.href, pathname)

  return (
    <li className='w-full'>
      <Link href={item.href} className='w-full'>
        <Button
          variant='ghost'
          className={cn(
            'hover:bg-primary hover:text-primary-foreground flex h-10 w-full items-center gap-2 rounded-xl px-3 text-base font-medium',
            { 'bg-primary text-primary-foreground': isActive }
          )}
        >
          {item.Icon && <item.Icon className='size-5' />}
          <span className='whitespace-nowrap'>{item.title}</span>
        </Button>
      </Link>
    </li>
  )
}
