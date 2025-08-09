import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuItem } from '../type'
import { isLocationMatch } from '../utils'

type MultiNestedMenuProps = {
  subItem: MenuItem
  subIndex: number
  activeMultiMenu: number | null
}

const MultiNestedMenu = ({ subItem, subIndex, activeMultiMenu }: MultiNestedMenuProps) => {
  const pathname = usePathname()

  return (
    <Collapsible open={activeMultiMenu === subIndex}>
      <CollapsibleContent className='CollapsibleContent'>
        <ul className='space-y-3 pl-1'>
          {subItem?.multi_menu?.map((item: MenuItem, i: number) => {
            const isActive = isLocationMatch(item.href, pathname)
            return (
              <li className='first:pt-3' key={i}>
                <Link href={item.href ?? ''} target={item.target}>
                  <span
                    className={cn(
                      'hover:text-primary flex items-center gap-3 text-sm capitalize transition-all duration-150',
                      isActive ? 'text-primary' : 'text-default-600'
                    )}
                  >
                    <span
                      className={cn('border-default-500 inline-flex h-2 w-2 rounded-full border', {
                        'border-primary bg-primary ring-primary/30 ring-[4px]': isActive
                      })}
                    ></span>
                    <span className='flex-1'>{item.title}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default MultiNestedMenu
