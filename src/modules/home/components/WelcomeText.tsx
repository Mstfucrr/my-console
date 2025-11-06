import { motion } from 'framer-motion'

export default function WelcomeText() {
  return (
    <>
      {/* Welcome Text */}
      <motion.h1
        className='text-foreground text-center leading-tight font-bold tracking-tighter'
        style={{
          fontSize: 'clamp(3rem, 7vw, 6rem)',
          textShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className='relative'>
          <motion.span
            className='from-primary-200 via-primary-400 to-primary-300 block bg-linear-to-r bg-clip-text text-transparent'
            animate={{
              backgroundPosition: ['0% center', '100% center', '0% center']
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut'
            }}
            style={{
              backgroundSize: '200% auto'
            }}
          >
            Fiyuu&apos;ya
          </motion.span>
        </div>
        <div className='relative'>
          <motion.span
            className='from-primary-200 via-primary-400 to-primary-200 block bg-linear-to-r bg-clip-text text-transparent'
            animate={{
              backgroundPosition: ['100% center', '0% center', '100% center']
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut'
            }}
            style={{
              backgroundSize: '200% auto'
            }}
          >
            Hoş Geldiniz
          </motion.span>
        </div>
      </motion.h1>

      {/* Decorative Line */}
      <motion.div
        className='from-primary-300 to-primary-600 mt-8 h-1 w-24 rounded-full bg-linear-to-r'
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      />
    </>
  )
}
