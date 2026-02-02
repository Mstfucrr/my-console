'use client'

import ErrorPage from '@/components/error-page'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorPage
      image='/images/error/light-500.png'
      title='Bir hata oluştu'
      description='Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
      action={{ label: 'Tekrar dene', onClick: reset }}
    />
  )
}
