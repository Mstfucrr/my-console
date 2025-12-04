import AuthPageLayout from '@/modules/auth/components/auth-page-layout'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <AuthPageLayout>{children}</AuthPageLayout>
}
