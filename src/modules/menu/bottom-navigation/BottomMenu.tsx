import { usePermission } from '@/hooks/use-permission'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ProfileButton } from '../common/profile-button'
import { SupportDialog } from '../common/support-dialog'
import { isLocationMatch } from '../utils'
import { MotionBottomNavigationItem } from './BottomNavigationItem'

const springConfig = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 0.5
}

type BottomMenuProps = {
  onClick: () => void
}
export function BottomMenu({ onClick }: BottomMenuProps) {
  const pathname = usePathname()
  const { checkRoute } = usePermission()
  const [openSupportDialog, setOpenSupportDialog] = useState(false)

  const hasReportsAccess = checkRoute('/reports')

  return (
    <motion.div
      variants={{
        hidden: { scale: 0, originX: 1, originY: 1, opacity: 0 },
        visible: { scale: 1, originX: 1, originY: 1, opacity: 1 }
      }}
      initial='hidden'
      animate='visible'
      exit='hidden'
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], ...springConfig }}
      className={cn(
        'absolute right-0 bottom-[110%] -z-10 h-[260%] w-[107%] origin-bottom-right rounded-tl-[100%] rounded-r-4xl rounded-bl-xl bg-white/70',
        openSupportDialog && 'bottom-7 h-0 overflow-hidden'
      )}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 0, x: 40 },
          visible: { opacity: 1, y: 0, x: 0 }
        }}
        initial='hidden'
        animate='visible'
        exit='hidden'
        transition={{ duration: 0.35, delay: 0.2, ease: [0.4, 0, 0.2, 1], ...springConfig }}
        className={cn('absolute bottom-[15%] -left-[10%]', !hasReportsAccess && 'bottom-[30%] -left-[5%]')}
      >
        <ProfileButton className='size-12 rounded-full p-0' />
      </motion.div>
      {hasReportsAccess && (
        <MotionBottomNavigationItem
          key='reports'
          variants={{
            hidden: { opacity: 0, y: 40, x: 40 },
            visible: { opacity: 1, y: 0, x: 0 }
          }}
          initial='hidden'
          animate='visible'
          exit='hidden'
          transition={{ duration: 0.35, delay: 0.3, ease: [0.4, 0, 0.2, 1], ...springConfig }}
          href='/reports'
          label='Raporlar'
          icon={FileText}
          isActive={isLocationMatch('/reports', pathname)}
          className='-bottom-[6%] left-[10%] size-15 rounded-full bg-white p-0'
          onClick={onClick}
        />
      )}
      <motion.div
        key='support'
        variants={{
          hidden: { opacity: 0, y: 40, x: 0 },
          visible: { opacity: 1, y: 0, x: 0 }
        }}
        initial='hidden'
        animate='visible'
        exit='hidden'
        transition={{ duration: 0.35, delay: 0.4, ease: [0.4, 0, 0.2, 1], ...springConfig }}
        className={cn(
          'absolute right-[14%] bottom-[86%] z-50',
          !hasReportsAccess && 'right-[20%] bottom-[75%] -translate-x-1/2'
        )}
      >
        <SupportDialog className='size-12 rounded-full p-2' onOpenStateChange={setOpenSupportDialog} />
      </motion.div>
    </motion.div>
  )
}
