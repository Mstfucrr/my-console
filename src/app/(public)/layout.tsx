import { AuthProvider } from '@/modules/auth/context/AuthContext'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
