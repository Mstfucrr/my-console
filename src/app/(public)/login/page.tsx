'use client'
import { AuthProvider } from '@/modules/auth/context/auth-context'
import { LoginView } from '@/modules/auth/views/login'
import { useEffect } from 'react'

export default function LoginPage() {
  useEffect(() => {
    window.history.replaceState(null, '', window.location.href)
  }, [])

  return (
    <AuthProvider>
      <LoginView />
    </AuthProvider>
  )
}
