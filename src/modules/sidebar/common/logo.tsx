'use client'

import { SiteLogoBig, SiteLogoMin } from '@/components/svg'
import { Button } from '@/components/ui/button'
import { useIsDesktop } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/store/sidebar'
import { AnimatePresence, motion } from 'framer-motion'
import { LockKeyhole, LockKeyholeOpen } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
const SidebarLogo = () => {
  const { setExpanded, expanded, hovered } = useSidebar()

  const isDesktop = useIsDesktop()

  const showBigLogo = useMemo(() => expanded || hovered, [expanded, hovered])

  return (
    <div className='px-4 py-4'>
      <div className='flex items-center gap-2'>
        <Link href='/' className='relative flex h-8 flex-1 items-center justify-center'>
          <AnimatePresence mode='wait'>
            {showBigLogo ? (
              <motion.div
                key='big-logo'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='absolute inset-0 flex items-center justify-center'
              >
                <SiteLogoBig className={cn('w-[75%]', { 'w-[60%]': !isDesktop })} />
              </motion.div>
            ) : (
              <motion.div
                key='min-logo'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className='absolute inset-0 flex items-center justify-center'
              >
                <SiteLogoMin className='size-10' />
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {(expanded || hovered) && isDesktop && (
          <div className='flex-none'>
            <Button variant='outline' size='icon' className='size-8' onClick={() => setExpanded(!expanded)}>
              {expanded ? <LockKeyhole className='size-5' /> : <LockKeyholeOpen className='size-5' />}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SidebarLogo
