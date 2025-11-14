'use client'
import LogInForm from '@/modules/auth/components/login-form'
import VerfiyForm from '@/modules/auth/components/verify-form'
import { ILoginResponse } from '@/modules/auth/types'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const LoginFormContent = () => {
  const [isOtp, setIsOtp] = useState(false)
  const [loginData, setLoginData] = useState<ILoginResponse | null>(null)

  const handleOtpRequired = (loginData: ILoginResponse) => {
    if (!loginData.otpSessionId) return
    setLoginData(loginData)
    setIsOtp(true)
  }

  return (
    <div className='mb-3 text-center'>
      <AnimatePresence mode='wait'>
        {!isOtp ? (
          <motion.div
            key='login-form'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <LogInForm onOtpRequired={handleOtpRequired} />
          </motion.div>
        ) : (
          <motion.div
            key='verify-form'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <VerfiyForm
              otpSessionId={loginData?.otpSessionId ?? ''}
              maskedPhoneNumber={loginData?.maskedPhoneNumber ?? ''}
            />
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
