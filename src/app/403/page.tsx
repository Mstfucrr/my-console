'use client'
import CustomImage from '@/components/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const ForbiddenPage = () => {
  return (
    <div className='flex min-h-screen items-center justify-center overflow-y-auto p-10'>
      <div className='flex w-full flex-col items-center'>
        <div className='max-w-[542px]'>
          <CustomImage src='/images/error/light-403.png' alt='error image' className='h-full w-full object-cover' />
        </div>
        <div className='mt-16 text-center'>
          <div className='text-default-900 text-2xl font-semibold md:text-4xl lg:text-5xl'>Ops! Erişim Reddedildi</div>
          <div className='text-default-600 mt-3 text-sm md:text-base'>Bu sayfaya erişim yetkiniz yok.</div>
          <Button asChild className='mt-9 md:min-w-[300px]' size='lg'>
            <Link href='/'>Anasayfaya Git</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ForbiddenPage
