'use client'

import ErrorPage from '@/components/error-page'
import { useAuth } from '@/context/AuthContext'

export function TenantModuleMaintenancePage() {
  const { logout } = useAuth()
  return (
    <div className='-my-20'>
      <ErrorPage
        image='/images/error/light-503.png'
        title='Kısa Bir Mola Verdik'
        description='Çok yakında tekrar buradayız. Lütfen daha sonra tekrar deneyin veya destek ekibimizle iletişime geçin.'
        action={{ label: 'Çıkış yap', onClick: logout }}
      />
    </div>
  )
}
