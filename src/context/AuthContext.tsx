'use client'

import { getToken, removeToken } from '@/lib/local-storage-helper'
import { authService } from '@/modules/auth/service/auth.service'
import { usePathname, useRouter } from 'next/navigation'
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

  const logout = async () => {
    await toast.promise(
      async () => {
        await authService.logout()
        removeToken()
        setIsAuthenticated(false)
        router.push('/login')
      },
      {
        pending: 'Çıkış yapılıyor...',
        success: 'Başarıyla çıkış yapıldı.',
        error: 'Çıkış yapılırken bir hata oluştu. Lütfen tekrar deneyiniz.'
      }
    )
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
