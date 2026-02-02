import CustomImage from '@/components/image'
import { Button } from '@/components/ui/button'
import { Route } from 'next'
import Link from 'next/link'

type ErrorPageProps = {
  image: string
  title: string
  description: string
  action?: {
    label: string
    href?: Route
    onClick?: () => void
  }
}

export default function ErrorPage({
  image,
  title,
  description,
  action = { label: 'Anasayfaya Git', href: '/' }
}: ErrorPageProps) {
  return (
    <div className='flex min-h-screen items-center justify-center overflow-y-auto p-10'>
      <div className='flex w-full flex-col items-center'>
        <div className='max-w-[542px]'>
          <CustomImage src={image} alt={title} className='h-full w-full object-cover' />
        </div>
        <div className='mt-16 text-center'>
          <div className='text-default-900 text-2xl font-semibold md:text-4xl lg:text-5xl'>{title}</div>
          <div className='text-default-600 mt-3 text-sm md:text-base'>{description}</div>
          {action.href ? (
            <Button asChild className='mt-9 md:min-w-[300px]' size='lg'>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button className='mt-9 md:min-w-[300px]' size='lg' onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
