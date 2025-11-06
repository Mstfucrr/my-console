import ErrorPage from '@/components/error-page'

export default function TooManyRequestsPage() {
  return (
    <ErrorPage
      image='/images/error/light-429.png'
      title='Çok Fazla İstek'
      description='Çok fazla istek gönderildi. Lütfen bir süre bekleyip tekrar deneyin.'
    />
  )
}
