'use client'

import { ResetPasswordView } from '@/modules/auth/views/reset-password'
import { Suspense } from 'react'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className='py-8 text-center'>Yükleniyor...</div>}>
      <ResetPasswordView />
    </Suspense>
  )
}
