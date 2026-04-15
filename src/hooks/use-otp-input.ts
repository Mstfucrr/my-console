'use client'

import { useCallback } from 'react'

export const createEmptyOtp = (length: number) => Array.from({ length }, () => '')

type UseOtpInputParams = {
  length: number
  values: string[]
  setValues: React.Dispatch<React.SetStateAction<string[]>>
  inputRefs: React.MutableRefObject<Array<HTMLInputElement | null>>
  onEnter?: () => void
}

export function useOtpInput({ length, values, setValues, inputRefs, onEnter }: UseOtpInputParams) {
  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/[^0-9]/g, '').slice(0, 1)

      setValues(prev => {
        const next = [...prev]
        next[index] = digit
        return next
      })

      if (digit && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    },
    [inputRefs, length, setValues]
  )

  const handleOtpPaste = useCallback(
    (index: number, value: string) => {
      const cleaned = value.replace(/\D/g, '')
      if (!cleaned) return

      setValues(prev => {
        const next = [...prev]
        for (let i = 0; i < cleaned.length && index + i < length; i++) {
          next[index + i] = cleaned[i]
        }
        return next
      })

      const focusIndex = Math.min(index + cleaned.length, length - 1)
      setTimeout(() => inputRefs.current[focusIndex]?.focus(), 0)
    },
    [inputRefs, length, setValues]
  )

  const handleOtpKeyDown = useCallback(
    (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace' && values[index] === '' && index > 0) {
        setValues(prev => {
          const next = [...prev]
          next[index - 1] = ''
          return next
        })
        inputRefs.current[index - 1]?.focus()
        return
      }

      if (event.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus()
        return
      }

      if (event.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
        return
      }

      if (event.key === 'Enter') {
        onEnter?.()
      }
    },
    [inputRefs, length, onEnter, setValues, values]
  )

  return {
    handleOtpChange,
    handleOtpPaste,
    handleOtpKeyDown
  }
}
