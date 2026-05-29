'use client'

import { useEffect, useRef } from 'react'

export const TAB_INACTIVE_DISABLE_AFTER_MS = 60_000

type UseEnabledOnActiveTabOptions = {
  disableAfterMs?: number
  activeAfterMs?: number
  onDisable?: () => void
  onEnable?: () => void
  isInactive?: (visibilityState: DocumentVisibilityState) => boolean
}

export function useEnabledOnActiveTab({
  disableAfterMs = TAB_INACTIVE_DISABLE_AFTER_MS,
  activeAfterMs = 0,
  onDisable,
  onEnable,
  isInactive = visibilityState => visibilityState === 'hidden'
}: UseEnabledOnActiveTabOptions = {}) {
  const enabledRef = useRef(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateTitleByState = (state: DocumentVisibilityState) => {
    document.title =
      state === 'hidden' && !document.title.includes('▶️') ? '▶️ ' + document.title : document.title.replace('▶️ ', '')
  }

  useEffect(() => {
    const clear = () => {
      if (!timerRef.current) return
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }

    const enable = () => {
      clear()
      const doEnable = () => {
        const wasEnabled = enabledRef.current
        enabledRef.current = true
        if (!wasEnabled) {
          onEnable?.()
          updateTitleByState('visible')
        }
      }
      requestAnimationFrame(
        activeAfterMs > 0 ? () => (timerRef.current = setTimeout(doEnable, activeAfterMs)) : doEnable
      )
    }

    const scheduleDisable = () => {
      clear()
      timerRef.current = setTimeout(() => {
        const wasEnabled = enabledRef.current
        enabledRef.current = false
        if (wasEnabled) {
          onDisable?.()
          updateTitleByState('hidden')
        }
      }, disableAfterMs)
    }

    const onVisibilityChange = () => (isInactive(document.visibilityState) ? scheduleDisable() : enable())

    onVisibilityChange()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      clear()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [activeAfterMs, disableAfterMs, isInactive, onDisable, onEnable])

  return enabledRef
}
