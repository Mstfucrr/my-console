'use client'
import LogInForm from '@/modules/auth/components/login-form'
import VerfiyForm from '@/modules/auth/components/verify-form'
import { useAuthContext } from '@/modules/auth/context/AuthContext'
import { AnimatePresence, motion } from 'framer-motion'

const LoginFormContent = () => {
  const { isOtp } = useAuthContext()

  return (
    <div className='mb-3 text-center'>
      <h1 className='text-primary -mt-3 mb-4 text-2xl font-bold'>
        {isOtp ? 'Doğrulama Kodu' : "Partner'a Hoşgeldiniz"}
      </h1>

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
  return <LoginFormContent />
}

export default LoginPage
