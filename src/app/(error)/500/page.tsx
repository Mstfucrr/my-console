import ErrorPage from '@/components/error-page'

export default function InternalServerErrorPage() {
  return (
    <ErrorPage
      image='/images/error/light-500.png'
      title='Sunucu Hatası'
      description='Sunucuya bağlanırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    />
  )
}
