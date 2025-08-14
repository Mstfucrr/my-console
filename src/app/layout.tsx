import '@/styles/globals.css'
import { Open_Sans } from 'next/font/google'
import Script from 'next/script'

import { cn } from '@/lib/utils'
import QueryProvider from '@/provider/QueryProvider'
import type { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'

// Initialize Poppins font
const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-open-sans',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'New Console'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='tr'>
      <head>
        {process.env.NODE_ENV === 'development' && (
          <Script src='//unpkg.com/react-scan/dist/auto.global.js' crossOrigin='anonymous' />
        )}
      </head>
      <body className={cn(openSans.className, 'antialiased')}>
        <QueryProvider>{children}</QueryProvider>
        <ToastContainer autoClose={2500} />
      </body>
    </html>
  )
}
