'use client'
import CustomImage from '@/components/image'
import { Loader2 } from 'lucide-react'

const LayoutLoader = () => {
  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <CustomImage src='/images/logo/logo-pink.png' alt='logo' className='text-primary size-16' />
      <span className='inline-flex items-center justify-center gap-2'>
        <Loader2 className='size-5 animate-spin' />
        Yükleniyor...
      </span>
    </div>
  )
}

export default LayoutLoader
