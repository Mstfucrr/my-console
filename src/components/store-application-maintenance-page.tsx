import ErrorPage from '@/components/error-page'

export function StoreApplicationMaintenancePage() {
  return (
    <div className='-my-20'>
      <ErrorPage
        image='/images/error/light-503.png'
        title='Kısa Bir Mola Verdik'
        description='Çok yakında tekrar buradayız. Lütfen daha sonra tekrar deneyin veya destek ekibimizle iletişime geçin.'
        action={{ label: 'Başvurularıma Git', href: '/applications' }}
      />
    </div>
  )
}
