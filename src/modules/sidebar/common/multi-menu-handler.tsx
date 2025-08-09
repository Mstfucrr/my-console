'use client'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { MenuItem } from '../type'
import { isLocationMatch } from '../utils'

type MultiMenuHandlerProps = {
  subItem: MenuItem
  subIndex: number
  activeMultiMenu: number | null
  toggleMultiMenu: (subIndex: number) => void
  className?: string
}

const MultiMenuHandler = ({
  subItem,
  subIndex,
  activeMultiMenu,
  toggleMultiMenu,
  className
}: MultiMenuHandlerProps) => {
  const pathname = usePathname()

  // Check if any multi-menu item is active
  const isMultiMenuActive = subItem.multi_menu?.some(item => isLocationMatch(item.href ?? '', pathname))

  return (
    <div
      onClick={() => toggleMultiMenu(subIndex)}
      className={cn(
        'before: relative top-0 flex cursor-pointer items-center gap-3 rounded text-sm transition-all duration-150 before:absolute before:-left-5 before:h-0 before:w-[3px] before:transition-all before:duration-200',
        className,
        {
          'text-primary before:bg-primary before:h-full': activeMultiMenu === subIndex || isMultiMenuActive,
          'text-default-700 hover:text-primary': activeMultiMenu !== subIndex && !isMultiMenuActive
        }
      )}
    >
      <span className='flex-1'>{subItem.title}</span>
      <div className='flex-none'>
        <span
          className={cn('*:transform *:transition-all *:duration-300', {
            '*:rotate-90': activeMultiMenu === subIndex || isMultiMenuActive
          })}
        >
          <ChevronRight className='h-5 w-5' />
        </span>
      </div>
    </div>
  )
}

export default MultiMenuHandler
