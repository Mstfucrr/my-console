import '@/styles/globals.css'
import { Open_Sans } from 'next/font/google'

import { AppErrorBoundary } from '@/components/app-error-boundary'
import { InstanaEum } from '@/components/instana-eum'
import { TooltippedElement } from '@/components/tooltipped-element'
import { cn } from '@/lib/utils'
import { AnalyticsProvider } from '@/provider/AnalyticsProvider'
import { QueryProvider } from '@/provider/QueryProvider'
import { APP_VERSION } from '@/version'
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
      <head>
        <InstanaEum />

        {process.env.NODE_ENV === 'development' && (
          /* eslint-disable-next-line @next/next/no-sync-scripts */
          <script crossOrigin='anonymous' src='//unpkg.com/react-scan/dist/auto.global.js' />
        )}
      </head>
      <body className={cn(openSans.className, 'antialiased')}>
        <QueryProvider>
          <AppErrorBoundary>
            <AnalyticsProvider>{children}</AnalyticsProvider>
          </AppErrorBoundary>
        </QueryProvider>
        <ToastContainer autoClose={2500} pauseOnFocusLoss={false} limit={6} stacked />
        <TooltippedElement tooltipContent='Versiyon' className='p-0.5 text-[10px]'>
          <span className='bg-background fixed bottom-0 left-1/2 z-500 rounded-full p-1 py-0.5 text-[10px] max-sm:-translate-x-1/2 sm:bottom-2 sm:left-3'>
            {APP_VERSION}
          </span>
        </TooltippedElement>
      </body>
    </html>
  )
}
