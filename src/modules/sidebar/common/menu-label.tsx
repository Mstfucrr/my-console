import { cn } from '@/lib/utils'
import { type MenuItem } from '@/modules/sidebar/type'
import { useSidebar } from '@/store/sidebar'

type MenuLabelProps = {
  item: MenuItem
  className?: string
}

const MenuLabel = ({ item, className }: MenuLabelProps) => {
  const { expanded, hovered } = useSidebar()
  const { title } = item

  return (
    <h3
      className={cn('text-default-900 mt-4 mb-3 text-xs font-semibold uppercase', className, {
        'text-lg': expanded || hovered
      })}
    >
      {title}
    </h3>
  )
}

export default MenuLabel
