'use client'
import CustomImage from '@/components/image'
import { SiteLogoMin } from '@/components/svg'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
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
      <Card className='relative h-[600px] w-full overflow-hidden rounded-4xl shadow-none'>
        <div className={cn('flex h-full w-full', isOtp && 'flex-row-reverse')}>
          <AnimatePresence initial={false}>
            {/* Left side */}
            <div className='relative h-full w-1/2'>
              {!isOtp ? (
                <motion.div
                  key='login-panel'
                  className='absolute inset-0 flex items-center p-8'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LogInForm />
                </motion.div>
              ) : (
                <motion.div
                  key='verify-panel'
                  className='absolute inset-0 flex items-center p-8'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <VerfiyForm />
                </motion.div>
              )}
            </div>
            <motion.div
              layoutId='purple-panel'
              className='bg-primary absolute inset-0 flex w-1/2 items-center justify-center rounded-4xl shadow-lg'
              animate={{
                left: !isOtp ? '50%' : '0%',
                borderRadius: isOtp ? '0% 30% 30% 0%' : '30% 0% 0% 30%'
              }}
              transition={{ duration: 0.3 }}
            >
              <div className='flex flex-col items-center justify-center gap-6 text-white'>
                <SiteLogoMin className='w-60 text-white' />
                <div className='text-2xl font-bold 2xl:text-3xl'>
                  <b>Console&apos;a</b> Hoşgeldiniz
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Card>
    </div>
  )
}

const LoginPage = () => {
  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden py-10'>
      <CustomImage
        src='/images/auth/auth3-light.png'
        alt='background image'
        className='absolute top-0 left-0 h-full w-full'
      />
      <div className='bg-background relative z-10 m-4 w-full max-w-6xl rounded-4xl p-5'>
        <LoginFormContent />
      </div>
    </div>
  )
}

export default LoginPage
