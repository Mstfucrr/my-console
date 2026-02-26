'use client'

import { useProfile } from '@/context/ProfileProvider'
import { Order } from '@/types'
import { IProfileResponse } from '@/types/profile'
import { useEffect, useMemo, useRef, useState } from 'react'
import { adoptWidgetIframe, cleanupWidgetDom, ensureWidgetScript, isWidgetConfigured } from '../widget/alotech-widget'

/**
 * AloTech chat widget'ını başlatmak için hook parametreleri.
 */
type UseAlotechWidgetParams = {
  enabled: boolean
  token: string
  order?: Order
}

/**
 * Widget'ın ihtiyaç duyduğu minimal kullanıcı/restaurant oturum bilgisi.
 */
type WidgetSession = {
  userId: string
  restaurantId: string
  restaurantName?: string
  restaurantEmail?: string
  phoneNumber?: string
  hubId?: string
  hubName?: string
}

const IFRAME_SELECTOR = '#Click2ConnectPackageFrame'
const IFRAME_READY_TIMEOUT_MS = 15000
const SCRIPT_READY_TIMEOUT_MS = 15000
const IFRAME_APPEAR_TIMEOUT_MS = 15000

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => reject(new Error(message)), ms)
    promise.then(
      val => {
        window.clearTimeout(timeoutId)
        resolve(val)
      },
      err => {
        window.clearTimeout(timeoutId)
        reject(err)
      }
    )
  })
}

/**
 * Profile verisini widget'ın ihtiyaç duyduğu minimal session formatına indirger.
 * @returns Gerekli alanlar yoksa `null`.
 */
function getWidgetSession(profile?: IProfileResponse): WidgetSession | null {
  if (!profile?.info || !profile.userId || !profile.restaurantId) return null

  return {
    userId: profile.userId,
    restaurantId: profile.restaurantId,
    restaurantName: profile.info.name,
    restaurantEmail: profile.email,
    phoneNumber: profile.info.authPhone,
    hubId: profile.info.hubId,
    hubName: profile.hubName
  }
}

/**
 * Widget'a gönderilecek `user_data` payload'unu order/hub bilgileriyle oluşturur.
 */
function buildWidgetUserData({ token, order, session }: { token: string; order?: Order; session: WidgetSession }) {
  const userData: Record<string, unknown> = {
    token,
    userId: session.userId,
    restaurantId: session.restaurantId,
    restaurantName: session.restaurantName ?? ''
  }

  if (order) {
    userData.orderId = order.orderId
    userData.customerName = order.customerName
  }

  if (session.hubId) userData.hubId = session.hubId
  if (session.hubName) userData.hubName = session.hubName

  return userData
}

/**
 * Iframe görünür hale geldiğinde yüklenmesini bekler; bulunamazsa DOM değişimlerini izler.
 * @returns Cleanup fonksiyonu (observer/timeout temizler).
 */
function waitUntilIframeReady({
  container,
  cancelledRef,
  onReady
}: {
  container: HTMLDivElement
  cancelledRef: { current: boolean }
  onReady: () => void
}) {
  let observer: MutationObserver | null = null
  let readyTimeout: number | null = null

  // Iframe load event'i geldiğinde chat'i hazır kabul eder; gecikmede timeout fallback kullanır.
  const markReadyFromIframeLoad = () => {
    const iframe = document.querySelector<HTMLIFrameElement>(IFRAME_SELECTOR)
    if (!iframe) return false

    iframe.addEventListener(
      'load',
      () => {
        if (!cancelledRef.current) onReady()
      },
      { once: true }
    )

    readyTimeout = window.setTimeout(() => {
      if (!cancelledRef.current) onReady()
    }, IFRAME_READY_TIMEOUT_MS)

    return true
  }

  // Body'ye eklenen iframe'i popover içine taşır ve hazır olma dinleyicisini bağlar.
  const connectIframe = () => {
    if (!adoptWidgetIframe(container)) return false
    return markReadyFromIframeLoad()
  }

  if (!connectIframe()) {
    observer = new MutationObserver(() => {
      if (!connectIframe()) return
      observer?.disconnect()
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }

  return () => {
    observer?.disconnect()
    if (readyTimeout) window.clearTimeout(readyTimeout)
  }
}

/**
 * Chat widget scriptini başlatır, iframe'i popover içine taşır ve hazır olma durumunu yönetir.
 *
 * @returns `containerRef`: iframe'in taşınacağı container ref'i
 * @returns `isReady`: iframe hazır kabul edildiğinde `true`
 * @returns `hasError`: başlatma/yükleme hatası oluştuysa `true`
 */
export function useAlotechWidget({ enabled, token, order }: UseAlotechWidgetParams) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { profile } = useProfile()
  const session = useMemo(() => getWidgetSession(profile), [profile])

  useEffect(() => {
    if (!enabled) return
    if (!token || !session) return
    // Widget script'i dışarıdan inject edildiyse env kontrolünü bypass edebiliriz.
    if (!isWidgetConfigured() && !window.startWidget) {
      console.error('Chat widget yapılandırması eksik.')
      requestAnimationFrame(() => setError('Chat widget yapılandırması eksik.'))
      return
    }
    const container = containerRef.current
    if (!container) {
      console.error('Chat container bulunamadı.')
      requestAnimationFrame(() => setError('Chat container bulunamadı.'))
      return
    }

    const cancelledRef = { current: false }
    let stopWatchingIframe = () => {}
    let iframeAppearTimeout: number | null = null

    // Script hazırsa widget'i başlatır ve iframe hazır olduğunda isReady=true yapar.
    const start = async () => {
      try {
        setError(null)
        setIsReady(false)

        await withTimeout(ensureWidgetScript(), SCRIPT_READY_TIMEOUT_MS, 'Chat widget script hazırlanamadı.')
        if (cancelledRef.current || !window.startWidget) return

        const userData = buildWidgetUserData({ token, order, session })

        window.startWidget({
          client_name: session.restaurantName ?? '',
          client_email: session.restaurantEmail ?? '',
          phone_number: session.phoneNumber ?? '',
          user_data: {
            ...userData,
            client_email: session.restaurantEmail ?? '',
            phone_number: session.phoneNumber ?? ''
          }
        })

        // Bazı senaryolarda (CSP/adblock/script bug) iframe hiç basılmayabilir; loader'da takılmayı engelle.
        iframeAppearTimeout = window.setTimeout(() => {
          if (cancelledRef.current) return
          console.error('Chat widget iframe görünmedi (timeout).')
          setError('Chat widget yüklenemedi.')
          cleanupWidgetDom()
        }, IFRAME_APPEAR_TIMEOUT_MS)

        stopWatchingIframe = waitUntilIframeReady({
          container,
          cancelledRef,
          onReady: () => {
            if (iframeAppearTimeout) window.clearTimeout(iframeAppearTimeout)
            setIsReady(true)
          }
        })
      } catch (err) {
        if (cancelledRef.current) return
        console.error('Chat widget başlatılamadı.', err)
        setError(err instanceof Error ? err.message : 'Chat widget başlatılamadı.')
        cleanupWidgetDom()
      }
    }

    void start()

    return () => {
      // Effect kapanırken gözlemleri durdurur ve widget'ın bıraktığı DOM'u temizler.
      cancelledRef.current = true
      stopWatchingIframe()
      if (iframeAppearTimeout) window.clearTimeout(iframeAppearTimeout)
      cleanupWidgetDom()
    }
  }, [enabled, token, order, session])

  return {
    containerRef,
    isReady,
    hasError: Boolean(error)
  }
}
