import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import CustomImage from './image'

interface AnimatedLogoProps {
  className?: string
}

export default function AnimatedLogo({ className }: AnimatedLogoProps) {
  return (
    <motion.div
      className={cn('flex items-center justify-center', className)}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        type: 'spring',
        stiffness: 200,
        damping: 15
      }}
    >
      <div className='relative h-32 w-32 md:h-40 md:w-40'>
        {/* Middle polygon */}
        <motion.div
          className='bg-background absolute inset-0 m-4'
          style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
          animate={{
            rotate: [360, 0]
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear'
          }}
        />

        {/* Inner polygon */}
        <motion.div
          className='bg-primary-400 absolute inset-0 m-6'
          style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
          animate={{
            rotate: [0, 360],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{
            rotate: {
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear'
            },
            scale: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut'
            }
          }}
        />

        {/* Center letter */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <CustomImage src='/images/logo/logo-primary.png' alt='logo' className='size-1/2 object-contain' />
        </div>
      </div>
    </motion.div>
  )
}
