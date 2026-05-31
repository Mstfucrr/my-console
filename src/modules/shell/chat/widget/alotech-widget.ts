'use client'

/**
 * AloTech Click2Connect widget entegrasyonu için yardımcı fonksiyonlar.
 * Script yükleme, iframe taşıma ve DOM temizliği işlemlerini içerir.
 */
declare global {
  interface Window {
    startWidget?: (config: {
      client_name: string
      client_email: string
      phone_number: string
      user_data: Record<string, unknown>
    }) => void
  }
}

const SCRIPT_ATTR = 'data-alotech-click2connect'
const IFRAME_ID = 'Click2ConnectPackageFrame'
const IFRAME_SELECTOR = `#${IFRAME_ID}`
const EXTRA_ROOT_SELECTOR = '.alotech-chat-body'

const CLICK2CONNECT_SRC = process.env.NEXT_PUBLIC_ALOTECH_CLICK2CONNECT_SRC
const WIDGET_KEY = process.env.NEXT_PUBLIC_ALOTECH_WIDGET_KEY

let scriptPromise: Promise<void> | null = null

/**
 * Widget için gerekli env değişkenleri tanımlı mı?
 * @returns Env'ler doluysa `true`, değilse `false`.
 */
export function isWidgetConfigured() {
  return Boolean(CLICK2CONNECT_SRC && WIDGET_KEY)
}

/**
 * Click2Connect script'ini sayfaya ekler (tek sefer) ve hazır olana kadar bekler.
 * - Script zaten yüklüyse tekrar eklemez.
 * - Env eksikse hata fırlatır.
 */
export function ensureWidgetScript() {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.startWidget) return Promise.resolve()
  if (!isWidgetConfigured()) return Promise.reject(new Error('Missing chat widget env variables'))
  if (scriptPromise) return scriptPromise

  const scriptUrl = `${CLICK2CONNECT_SRC}?widget_key=${encodeURIComponent(WIDGET_KEY as string)}`

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[${SCRIPT_ATTR}="true"]`)

    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve()
        return
      }

      const onLoad = () => resolve()
      const onError = () => reject(new Error('Chat widget script yüklenemedi.'))
      existing.addEventListener('load', onLoad, { once: true })
      existing.addEventListener('error', onError, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = scriptUrl
    script.type = 'text/javascript'
    script.async = true
    script.setAttribute(SCRIPT_ATTR, 'true')
    script.onload = () => {
      script.dataset.loaded = 'true'
      resolve()
    }
    script.onerror = () => reject(new Error('Chat widget script yüklenemedi.'))
    document.body.appendChild(script)
  }).catch(err => {
    scriptPromise = null
    throw err
  })

  return scriptPromise
}

/**
 * Iframe'ı container içinde düzgün görünecek şekilde stiller.
 * @param iframe Widget'ın ürettiği iframe.
 */
function normalizeIframeStyle(iframe: HTMLIFrameElement) {
  iframe.style.position = 'static'
  iframe.style.inset = 'auto'
  iframe.style.bottom = 'auto'
  iframe.style.left = 'auto'
  iframe.style.right = 'auto'
  iframe.style.height = '100%'
  iframe.style.width = '100%'
  iframe.style.marginRight = '0px'
  iframe.style.marginLeft = '0px'
  iframe.style.zIndex = '1'
}

/**
 * Widget'ın oluşturduğu iframe(ler)i döndürür.
 */
function getWidgetIframes() {
  return Array.from(document.querySelectorAll<HTMLIFrameElement>(IFRAME_SELECTOR))
}

/**
 * Widget bazen body'ye birden fazla iframe basabiliyor.
 * Her zaman en son üretileni container'a taşır, fazlalıkları siler.
 *
 * @param container Iframe'ın taşınacağı HTML container.
 * @returns Iframe bulundu/taşındıysa `true`, yoksa `false`.
 */
export function adoptWidgetIframe(container: HTMLElement) {
  const iframes = getWidgetIframes()
  if (iframes.length === 0) return false

  const activeIframe = iframes[iframes.length - 1]
  for (let i = 0; i < iframes.length - 1; i += 1) {
    iframes[i].remove()
  }

  if (!container.contains(activeIframe)) {
    container.replaceChildren()
    container.appendChild(activeIframe)
  }

  normalizeIframeStyle(activeIframe)
  return true
}

/**
 * Widget'ın DOM'a bıraktığı iframe ve ekstra root node'ları temizler.
 * (Örn. component unmount olduğunda çağrılır.)
 */
export function cleanupWidgetDom() {
  getWidgetIframes().forEach(iframe => iframe.remove())
  document.querySelectorAll(EXTRA_ROOT_SELECTOR).forEach(node => node.remove())
}
