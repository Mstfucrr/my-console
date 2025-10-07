'use client'
import { SiteLogoMin } from '@/components/svg'
import { Card } from '@/components/ui/card'
import LogInForm from '@/modules/auth/components/login-form'
import VerfiyForm from '@/modules/auth/components/verify-form'
import { useAuthContext } from '@/modules/auth/context/AuthContext'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const LoginFormContent = () => {
  const { isOtp } = useAuthContext()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className='flex items-center justify-center'>
      <Card className='w-full max-w-md rounded-3xl p-8 shadow-lg'>
        <div className='mb-3 text-center'>
          <SiteLogoMin className='text-primary mx-auto w-32' />
          <h1 className='text-primary text-2xl font-bold'>{isOtp ? 'Doğrulama Kodu' : "Console'a Hoşgeldiniz"}</h1>
        </div>

        <AnimatePresence mode='wait'>
          {!isOtp ? (
            <motion.div
              key='login-form'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <LogInForm />
            </motion.div>
          ) : (
            <motion.div
              key='verify-form'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VerfiyForm />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}

const LoginPage = () => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='w-full max-w-md'>
        <LoginFormContent />
      </div>
    </div>
  )
}

export default LoginPage
