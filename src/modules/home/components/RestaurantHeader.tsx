import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/context/ProfileProvider'
import { motion } from 'framer-motion'

export function RestaurantHeader() {
  const { profile, isLoading: isProfileLoading } = useProfile()
  if (isProfileLoading) {
    return <Skeleton className='-my-1 h-8 w-full max-w-sm self-center' />
  }

  return (
    profile?.info.name && (
      <div className='flex w-full items-center justify-center gap-3 text-center'>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className='from-primary/10 to-primary h-0.5 w-10 origin-right rounded-full bg-linear-to-r sm:w-20'
        />
        <motion.h1
          variants={{
            hidden: { scale: 0.5, opacity: 0, y: 10 },
            visible: { scale: 1, opacity: 1, y: 0 }
          }}
          initial='hidden'
          animate='visible'
          transition={{
            duration: 0.7,
            delay: 0.5,
            scale: { delay: 1.5, duration: 0.7 },
            ease: 'easeInOut'
          }}
          className='text-primary flex gap-x-1 text-base font-bold max-sm:flex-col max-sm:text-sm'
        >
          <span>Hoşgeldiniz,</span>
          <span>{profile?.info.name.charAt(0).toUpperCase() + profile?.info.name.slice(1)}</span>
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className='from-primary/10 to-primary h-0.5 w-10 origin-left rounded-full bg-linear-to-l sm:w-20'
        />
      </div>
    )
  )
}
