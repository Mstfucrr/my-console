import ErrorPage from '@/components/error-page'

export default function NotFound() {
  return (
    <ErrorPage
      image='/images/error/light-404.png'
      title='Ops! Sayfa Bulunamadı'
      description='Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.'
    />
  )
}
