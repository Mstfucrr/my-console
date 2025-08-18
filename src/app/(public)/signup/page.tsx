'use client'

import { SiteLogoMin } from '@/components/svg'
import { Card } from '@/components/ui/card'
import { SignUpForm } from '@/modules/auth/components/sign-up-form'

export default function SignUpPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <Card className='w-full max-w-3xl rounded-3xl p-8 shadow-lg'>
        <div className='mb-8 text-center'>
          <SiteLogoMin className='text-primary mx-auto w-32' />
          <h1 className='text-primary text-2xl font-bold'>Fiyuu Portal&apos;a Hoş Geldiniz</h1>
          <p className='text-default-500 text-sm'>Restoranınızı dijital dünyaya taşımak için hesabınızı oluşturun</p>
        </div>

        <SignUpForm />

        <div className='mt-6 text-center text-sm'>
          <span className='text-default-500'>
            Zaten hesabınız var mı?{' '}
            <a href='/login' className='text-primary underline'>
              Giriş yapın
            </a>
          </span>
        </div>
      </Card>
    </div>
  )
}
