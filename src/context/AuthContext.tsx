'use client'

import { useRouter } from 'next/navigation'
import { createContext, useContext, useState } from 'react'

type AuthContextType = {
  isAuthenticated: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // useEffect(() => {
  //   // Sayfa yüklendiğinde cookie'deki token'ı kontrol et
  //   const cookieToken = getCookie('token')

  //   // Cookie token'ın varlığını kontrol et
  //   if (!cookieToken) {
  //     // Eğer cookie token yoksa, local storage'da bir token var mı kontrol et
  //     const localToken = localStorage.getItem('token')
  //     if (!localToken) {
  //       // Eğer local storage'da da token yoksa, kullanıcı kimlik doğrulaması yapılmamış
  //       // Kullanıcıyı giriş sayfasına yönlendir
  //       setIsAuthenticated(false)
  //       router.push('/signin')
  //     } else {
  //       // Eğer local token varsa, kullanıcı kimlik doğrulaması yapılmış
  //       setIsAuthenticated(true)
  //     }
  //   } else {
  //     // Eğer cookie token varsa, eski cookie'yi sil
  //     deleteCookie('token')
  //     localStorage.setItem('token', cookieToken)
  //     setIsAuthenticated(true)
  //   }
  // }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    router.push('/signout')
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
