'use client'

import ErrorPage from '@/components/error-page'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang='tr'>
      <body>
        <ErrorPage
          image='/images/error/light-500.png'
          title='Bir hata oluştu'
          description='Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
          action={{ label: 'Tekrar dene', onClick: reset }}
        />
      </body>
    </html>
  )
}
