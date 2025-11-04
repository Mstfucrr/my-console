import ErrorPage from '@/components/error-page'

export default function ForbiddenPage() {
  return (
    <ErrorPage
      image='/images/error/light-403.png'
      title='Ops! Erişim Reddedildi'
      description='Bu sayfaya erişim yetkiniz yok.'
    />
  )
}
