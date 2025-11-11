'use client'
import LogInForm from '@/modules/auth/components/login-form'
import VerfiyForm from '@/modules/auth/components/verify-form'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const LoginFormContent = () => {
  const [isOtp, setIsOtp] = useState(false)

  return (
    <div className='mb-3 text-center'>
      {isOtp && <h1 className='text-primary -mt-3 mb-4 text-2xl font-bold'>Doğrulama Kodu</h1>}

      <AnimatePresence mode='wait'>
        {!isOtp ? (
          <motion.div
            key='login-form'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <LogInForm onOtpRequired={() => setIsOtp(true)} />
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
    </div>
  )
}

const LoginPage = () => {
  return <LoginFormContent />
}

export default LoginPage
