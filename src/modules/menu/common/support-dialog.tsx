'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MessageCircle } from 'lucide-react'

export function SupportDialog(props?: ButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size='icon'
          className='bg-primary/90 hover:bg-primary relative text-white shadow-lg'
          title='Destek Ekibine Mail Gönder'
          {...props}
        >
          <MessageCircle className='size-6' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 border-0 bg-transparent p-0 shadow-none'>
        <div className='dark:bg-primary-10 border-primary/20 flex flex-col items-center gap-3 rounded-xl border bg-white p-4 pb-5 text-center shadow-xl'>
          <div className='bg-primary/10 flex size-12 items-center justify-center rounded-full'>
            <MessageCircle className='text-primary size-7' />
          </div>
          <span className='text-primary text-lg font-bold'>İletişim E-Postaları</span>

          <div className='flex w-max flex-col gap-1'>
            <span className='text-primary text-sm font-semibold'>Mutabakat sorularınız için:</span>
            <a
              href='mailto:restoranmutabakat@fiyuu.com.tr'
              className='text-primary hover:text-primary-700 font-medium break-all underline underline-offset-2 transition'
            >
              restoranmutabakat@fiyuu.com.tr
            </a>
          </div>
          <div className='mt-2 flex w-full flex-col gap-1'>
            <span className='text-primary text-sm font-semibold'>Fatura ile ilgili sorularınız için:</span>
            <a
              href='mailto:restoranmuhasebe@fiyuu.com.tr'
              className='text-primary hover:text-primary-700 font-medium break-all underline underline-offset-2 transition'
            >
              restoranmuhasebe@fiyuu.com.tr
            </a>
          </div>
          <div className='mt-2 flex w-full flex-col gap-1'>
            <span className='text-primary text-sm font-semibold'>Ödeme takibi konuları için:</span>
            <a
              href='mailto:odemeler@fiyuu.com.tr'
              className='text-primary hover:text-primary-700 font-medium break-all underline underline-offset-2 transition'
            >
              odemeler@fiyuu.com.tr
            </a>
          </div>
          <div className='mt-2 flex w-full flex-col gap-1'>
            <span className='text-primary text-sm font-semibold'>Restoran destek numaramız:</span>
            <a
              href='tel:08508006061'
              className='text-primary hover:text-primary-700 font-medium break-all underline underline-offset-2 transition'
            >
              0850 800 60 61
            </a>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
