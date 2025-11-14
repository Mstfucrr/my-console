'use client'

import { getToken, removeToken } from '@/lib/local-storage-helper'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, startTransition, useContext, useEffect, useState } from 'react'

type AuthContextType = {
  isAuthenticated: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return !!getToken().accessToken
  })

  const pathname = usePathname()

  // Check auth on pathname change
  useEffect(() => {
    const { accessToken } = getToken()
    startTransition(() => {
      if (accessToken) setIsAuthenticated(true)
      else {
        setIsAuthenticated(false)
        router.push('/login')
      }
    })
  }, [pathname, router])

  const logout = () => {
    removeToken()
    setIsAuthenticated(false)
    router.push('/login')
  }

  return <AuthContext.Provider value={{ isAuthenticated, logout }}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }
