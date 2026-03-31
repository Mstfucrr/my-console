'use client'

import { track } from '@/lib/analytics'
import { ANALYTICS_EVENTS } from '@/lib/analytics/events'
import { UserLogoutEvent } from '@/lib/analytics/types'
import { getToken, removeToken } from '@/lib/local-storage-helper'
import { authService } from '@/modules/auth/service/auth.service'
import { isPosthogEnabled } from '@/provider/AnalyticsProvider'
import { useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import posthog from 'posthog-js'
import { createContext, startTransition, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

type AuthContextType = {
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const pathname = usePathname()

  // Check auth on mount and pathname change
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }

      const { accessToken } = getToken()
      startTransition(() => {
        if (accessToken) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          // Only redirect if not already on login page
          if (pathname !== '/login' && pathname !== '/forgot-password' && pathname !== '/reset-password') {
            router.push('/login')
          }
        }
        setIsLoading(false)
      })
    }

    checkAuth()
  }, [pathname, router])

  const handleLogout = () => {
    queryClient.clear()
    track<UserLogoutEvent>(ANALYTICS_EVENTS.userLogout)
    removeToken()
    if (isPosthogEnabled) posthog.reset()
    setIsAuthenticated(false)
    router.push('/login')
  }

  const logout = async () => {
    try {
      await toast.promise(authService.logout(), {
        pending: 'Çıkış yapılıyor...',
        success: 'Başarılıyla çıkış yapıldı.'
      })
    } catch (e) {
      console.error('logout error', e)
    } finally {
      handleLogout()
    }
  }

  return <AuthContext.Provider value={{ isAuthenticated, isLoading, logout }}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }
