'use client'
import { SiteLogoMin } from '@/components/svg'
import { Card } from '@/components/ui/card'
import { ReactNode } from 'react'

interface AuthPageLayoutProps {
  children: ReactNode
  showLogo?: boolean
}

const AuthPageLayout = ({ children }: AuthPageLayoutProps) => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='w-full max-w-md'>
        <div className='flex items-center justify-center'>
          <Card className='w-full max-w-md rounded-3xl p-8 shadow-lg'>
            <div className='mb-4 text-center'>
              <SiteLogoMin className='text-primary mx-auto w-32' />
            </div>

            {children}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AuthPageLayout
