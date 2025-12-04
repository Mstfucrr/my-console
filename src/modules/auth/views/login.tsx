import { AnimatePresence, motion } from 'framer-motion'
import { LoginForm } from '../components/login-form'
import { VerifyForm } from '../components/verify-form'
import { useAuth } from '../context/auth-context'

export function LoginView() {
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
            <LoginForm />
          </motion.div>
        ) : (
          <motion.div
            key='verify-form'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <VerifyForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
