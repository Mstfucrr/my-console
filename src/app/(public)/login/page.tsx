'use client'
import LogInForm from '@/modules/auth/components/login-form'
import VerfiyForm from '@/modules/auth/components/verify-form'
import { AuthProvider, useAuth } from '@/modules/auth/context/auth-context'
import { AnimatePresence, motion } from 'framer-motion'

const LoginFormContent = () => {
  const { isOtp } = useAuth()

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
    </div>
  )
}

const LoginPage = () => {
  return (
    <AuthProvider>
      <LoginFormContent />
    </AuthProvider>
  )
}

export default LoginPage
