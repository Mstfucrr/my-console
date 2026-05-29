'use client'
import { AuthProvider } from '@/modules/auth/context/auth-context'
import { LoginView } from '@/modules/auth/views/login'

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginView />
    </AuthProvider>
  )
}
