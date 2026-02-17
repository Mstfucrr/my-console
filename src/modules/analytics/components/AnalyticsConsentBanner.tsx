'use client'

import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'

import { Cookie } from 'lucide-react'
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  AnalyticsConsent,
  clearAnalyticsConsent,
  getAnalyticsConsent,
  setAnalyticsConsent
} from '../utils/analytics-consent'

import { TooltippedElement } from '@/components/tooltipped-element'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Route } from 'next'
import { useEffect, useMemo, useState } from 'react'

const publicRoutes: Route[] = ['/login', '/forgot-password', '/reset-password']

export function AnalyticsConsentBanner() {
  const pathname = usePathname()
  const isPublicRoute = useMemo(() => publicRoutes.includes(pathname as Route), [pathname])
  const [consent, setConsent] = useState<AnalyticsConsent>(getAnalyticsConsent)

  useEffect(() => {
    // Burada consent değiştiğinde bannerı güncellemek için storage event listener'ı kullanıyoruz.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== ANALYTICS_CONSENT_STORAGE_KEY) return
      setConsent(getAnalyticsConsent())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleAccept = () => {
    setAnalyticsConsent('granted')
    setConsent('granted')
    posthog.opt_in_capturing()
  }

  const handleReject = () => {
    setAnalyticsConsent('denied')
    setConsent('denied')
    posthog.opt_out_capturing()
  }

  const handleManage = () => {
    clearAnalyticsConsent()
    setConsent(null)
    posthog.opt_out_capturing()
  }

  if (consent !== null) {
    return (
      <section
        aria-label='Çerez tercihleri'
        className={cn(
          'fixed inset-x-3 bottom-20 z-60 flex w-fit items-center sm:bottom-6 md:inset-x-6',
          isPublicRoute ? 'bottom-3' : 'bottom-20'
        )}
      >
        <TooltippedElement tooltipContent='Tercihleri yönetmek için tıklayın'>
          <Button
            onClick={handleManage}
            variant='outline'
            color='secondary'
            size='sm'
            className='size-auto rounded-full p-2'
          >
            <Cookie className='size-5' />
            <span className='sr-only'>Tercihleri yönet</span>
          </Button>
        </TooltippedElement>
      </section>
    )
  }

  return (
    <section
      aria-label='Çerez tercihleri'
      className='fixed inset-x-3 bottom-3 z-60 rounded-lg border bg-white p-4 shadow-lg md:inset-x-6 md:bottom-6'
    >
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6'>
        <div className='min-w-0'>
          <p className='text-foreground text-sm font-semibold'>Çerez tercihleri</p>
          <p className='text-muted-foreground mt-1 text-sm'>
            Partner panelini geliştirmek için anonim kullanım istatistiklerini analiz eden analitik çerezleri kullanmak
            istiyoruz. İsterseniz reddedebilir, kararınızı dilediğiniz zaman “Çerez tercihleri” üzerinden
            değiştirebilirsiniz.
          </p>
        </div>

        <div className='flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end'>
          <Button onClick={handleReject} variant='soft' color='secondary' size='sm'>
            Reddet
          </Button>
          <Button onClick={handleAccept} size='sm'>
            Kabul et
          </Button>
        </div>
      </div>
    </section>
  )
}
