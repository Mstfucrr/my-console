import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { LogoutButton } from '../common/logout-button'
import { SupportDialog } from '../common/support-dialog'
import { isLocationMatch } from '../utils'
import { MotionBottomNavigationItem } from './BottomNavigationItem'

export function BottomMenu() {
  const pathname = usePathname()
  return (
    <motion.div
      variants={{
        hidden: { scale: 0, originX: 1, originY: 1, opacity: 0 },
        visible: { scale: 1, originX: 1, originY: 1, opacity: 1 }
      }}
      initial='hidden'
      animate='visible'
      exit='hidden'
      transition={{ duration: 0.6, ease: 'easeInOut', type: 'spring' }}
      className='absolute right-0 bottom-[110%] -z-10 h-[260%] w-[107%] origin-bottom-right rounded-tl-[100%] rounded-r-4xl rounded-bl-xl bg-white/70'
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 0, x: 40 },
          visible: { opacity: 1, y: 0, x: 0 }
        }}
        initial='hidden'
        animate='visible'
        exit='hidden'
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeInOut', type: 'spring' }}
        className='absolute bottom-[15%] -left-[10%]'
      >
        <LogoutButton
          className='text-destructive size-12 rounded-full border-none bg-white p-0'
          iconClassName='size-6'
          color='light'
        />
      </motion.div>
      <MotionBottomNavigationItem
        key='reports'
        variants={{
          hidden: { opacity: 0, y: 40, x: 40 },
          visible: { opacity: 1, y: 0, x: 0 }
        }}
        initial='hidden'
        animate='visible'
        exit='hidden'
        transition={{ duration: 0.6, delay: 0.4, ease: 'easeInOut', type: 'spring' }}
        href='/reports'
        label='Raporlar'
        icon={FileText}
        isActive={isLocationMatch('/reports', pathname)}
        className='-bottom-[4%] left-[10%] size-15 rounded-full bg-white p-0'
      />
      <motion.div
        key='support'
        variants={{
          hidden: { opacity: 0, y: 40, x: 0 },
          visible: { opacity: 1, y: 0, x: 0 }
        }}
        initial='hidden'
        animate='visible'
        exit='hidden'
        transition={{ duration: 0.6, delay: 0.5, ease: 'easeInOut', type: 'spring' }}
        className='absolute right-[14%] bottom-[86%] z-50'
      >
        <SupportDialog className='size-12 rounded-full p-0' />
      </motion.div>
    </motion.div>
  )
}
