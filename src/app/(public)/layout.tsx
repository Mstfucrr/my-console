import AuthPageLayout from '@/modules/auth/components/auth-page-layout'
import { AuthProvider } from '@/modules/auth/context/AuthContext'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthPageLayout>{children}</AuthPageLayout>
    </AuthProvider>
  )
}
