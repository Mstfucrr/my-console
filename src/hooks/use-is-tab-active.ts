import { useEffect, useState } from 'react'

/**
 * Checks if the tab is active with a delay
 * @param delay - The delay in seconds
 * @returns True if the tab is active, false otherwise
 */
export default function useIsTabActive(delay: number = 0) {
  const [isTabActive, setIsTabActive] = useState(!document.hidden)

  useEffect(() => {
    const handler = () => {
      setTimeout(() => setIsTabActive(!document.hidden), delay * 1000)
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [delay])

  return isTabActive
}
