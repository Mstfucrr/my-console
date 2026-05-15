'use client'
import { allowedRoutesForEveryProfile } from '@/lib/permissions'
import { cn } from '@/lib/utils'
import { APP_VERSION } from '@/version'
import { Route } from 'next'
import { usePathname } from 'next/navigation'
import { TooltippedElement } from './tooltipped-element'

export function VersionView() {
  const pathname = usePathname()

  const isPublicUrl = allowedRoutesForEveryProfile.includes(pathname as Route)

  return (
    <>
      {APP_VERSION && APP_VERSION.trim() !== '' && (
        <TooltippedElement tooltipContent='Versiyon' className='p-0.5 text-[10px]'>
          <span
            className={cn(
              'bg-background fixed bottom-0 z-500 rounded-full p-1 py-0.5 text-[10px]',
              isPublicUrl
                ? 'right-1/2 translate-x-1/2 sm:bottom-0 lg:right-[22%] xl:right-[19%]'
                : 'left-1/2 max-sm:-translate-x-1/2 sm:bottom-2 sm:left-3'
            )}
          >
            {APP_VERSION}
          </span>
        </TooltippedElement>
      )}
    </>
  )
}
