import '@/styles/globals.css'
import { Open_Sans } from 'next/font/google'

import { AppErrorBoundary } from '@/components/app-error-boundary'
import { cn } from '@/lib/utils'
import { QueryProvider } from '@/provider/QueryProvider'
import type { Metadata, Viewport } from 'next'
import { ToastContainer } from 'react-toastify'

// Initialize Poppins font
const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-open-sans',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Partner',
  description:
    'Partner yönetim platformu. Sipariş takibi, mutabakat, raporlama ve daha fazlası için modern ve kullanıcı dostu arayüz.'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='tr'>
      {process.env.NODE_ENV === 'development' && (
        <head>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script crossOrigin='anonymous' src='//unpkg.com/react-scan/dist/auto.global.js' />
        </head>
      )}
      <body className={cn(openSans.className, 'antialiased')}>
        <QueryProvider>
          <AppErrorBoundary>{children}</AppErrorBoundary>
        </QueryProvider>
        <ToastContainer autoClose={2500} />
      </body>
    </html>
  )
}
