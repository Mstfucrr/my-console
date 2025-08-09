import '@/styles/globals.css'
import { Poppins } from 'next/font/google'

import { cn } from '@/lib/utils'
import QueryProvider from '@/provider/QueryProvider'
import type { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'

// Initialize Poppins font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
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
      <body className={cn(poppins.className, 'antialiased')}>
        <QueryProvider>{children}</QueryProvider>
        <ToastContainer autoClose={2500} />
      </body>
    </html>
  )
}
