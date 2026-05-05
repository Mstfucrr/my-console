import { Button, type ButtonProps } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'

type MenuPrimaryActionLinkProps = {
  href: Route
  label: string
  isOnRoute: boolean
  size: ButtonProps['size']
}

function MenuPrimaryActionButtonInner({ label, ...props }: { label: string } & ButtonProps) {
  return (
    <Button className='font-extrabold' color='success' {...props}>
      <Plus className='size-5' />
      <span className='ml-2 max-md:sr-only'>{label}</span>
    </Button>
  )
}

export function MenuPrimaryActionLink({ href, label, isOnRoute, size }: MenuPrimaryActionLinkProps) {
  if (isOnRoute) {
    return (
      <div className='relative flex flex-col items-center justify-center'>
        <MenuPrimaryActionButtonInner label={label} disabled size={size} />
      </div>
    )
  }

  return (
    <Link href={href}>
      <MenuPrimaryActionButtonInner label={label} size={size} />
    </Link>
  )
}
