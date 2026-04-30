import { Button } from '@/components/ui/button'
import { usePermission } from '@/hooks/use-permission'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { type MenuItem, type MultiMenuItem, type SingleMenuItem } from '../type'
import { isLocationMatch } from '../utils'

type MenuItemProps = {
  item: MenuItem
}

export function MenuItem({ item }: MenuItemProps) {
  if ('href' in item) return <SingleMenuItemView item={item} />
  return <MultiMenuItemView item={item} />
}

function SingleMenuItemView({ item }: { item: SingleMenuItem }) {
  const pathname = usePathname()
  const { checkRoute } = usePermission()

  if (!checkRoute(item.href)) return null

  const isActive = isLocationMatch(item.href, pathname)

  return (
    <li className='w-full'>
      <Link href={item.href} className='w-full'>
        <Button
          variant='ghost'
          size='xs'
          className={cn(
            'hover:bg-primary hover:text-primary-foreground flex w-full items-center gap-2 rounded-xl text-xs font-semibold',
            { 'bg-primary text-primary-foreground': isActive }
          )}
        >
          <item.Icon className='size-4.5' />
          <span className='whitespace-nowrap'>{item.title}</span>
        </Button>
      </Link>
    </li>
  )
}

function MultiMenuItemView({ item }: { item: MultiMenuItem }) {
  const pathname = usePathname()
  const { checkRoute } = usePermission()
  const [open, setOpen] = useState(false)

  const toggleOpen = () => setOpen(prev => !prev)

  const visibleChildren = item.children.filter(child => checkRoute(child.href))
  const isChildActive = visibleChildren.some(child => isLocationMatch(child.href, pathname))

  if (visibleChildren.length === 0) return null

  return (
    <li className='group relative w-full' onMouseLeave={() => setOpen(false)}>
      <Button
        variant='ghost'
        size='xs'
        className={cn(
          'hover:bg-primary hover:text-primary-foreground flex w-full items-center gap-2 rounded-xl text-xs font-semibold',
          { 'bg-primary text-primary-foreground': isChildActive }
        )}
        onClick={toggleOpen}
        onMouseEnter={() => setOpen(true)}
      >
        <item.Icon className='size-4.5' />
        <span className='whitespace-nowrap'>{item.title}</span>
        <ChevronDown className='size-3.5' />
      </Button>

      <div
        className={cn(
          'absolute top-full left-0 z-50 w-44 origin-top pt-1 transition-all duration-200 ease-out',
          open
            ? 'pointer-events-auto visible translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none invisible translate-y-1 scale-95 opacity-0'
        )}
      >
        <div className='bg-popover border-border pointer-events-auto flex flex-col gap-1 rounded-xl border p-1 shadow-lg'>
          {visibleChildren.map(child => (
            <Link key={child.href} href={child.href} className='block' onClick={toggleOpen}>
              <Button
                variant='ghost'
                size='xs'
                className={cn(
                  'hover:bg-primary hover:text-primary-foreground w-full justify-start rounded-lg text-xs',
                  isLocationMatch(child.href, pathname) && 'bg-primary text-primary-foreground'
                )}
              >
                {child.title}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </li>
  )
}
