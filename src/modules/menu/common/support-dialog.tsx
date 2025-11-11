'use client'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MessageCircle } from 'lucide-react'

export function SupportDialog() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size='lg'
          className='bg-primary/90 hover:bg-primary relative size-10 text-white shadow-lg'
          title='Destek Ekibine Mail Gönder'
        >
          <MessageCircle />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 border-0 bg-transparent p-0 shadow-none'>
        <div className='dark:bg-primary-10 border-primary/20 flex flex-col items-center gap-3 rounded-xl border bg-white p-6 shadow-xl'>
          <div className='bg-primary/10 mb-2 flex size-12 items-center justify-center rounded-full'>
            <MessageCircle className='text-primary size-7' />
          </div>
          <span className='text-primary text-lg font-bold'>Destek Mail Adresi</span>
          <a
            href='mailto:support@example.com'
            className='text-primary hover:text-primary-700 font-medium break-all underline underline-offset-2 transition'
          >
            support@example.com
          </a>
          <span className='text-muted-foreground mt-2 text-center text-xs'>
            Destek ekibimize e-posta göndererek ulaşabilirsiniz.
          </span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
