'use client'
import LayoutLoader from '@/components/layout-loader'
import { AuthProvider } from '@/context/AuthContext'
import { useMounted } from '@/hooks/use-mounted'
import { cn } from '@/lib/utils'
import Menu from '@/modules/menu'
import { motion } from 'framer-motion'
import 'leaflet/dist/leaflet.css'
import { usePathname } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const mounted = useMounted()
  const pathname = usePathname()
  const isOnboarding = pathname.includes('/onboarding') // TODO: Daha sonra ayrı olacak

  if (!mounted) return <LayoutLoader />

  return (
    <AuthProvider>
      {!isOnboarding && <Menu />}
      <div className={cn('transition-all duration-150', isOnboarding ? 'pt-10' : 'pt-16')}>
        <div className='flex flex-col gap-4 pb-0'>
          <LayoutWrapper>
            <div className='container mx-auto'>{children}</div>
          </LayoutWrapper>
        </div>
      </div>
    </AuthProvider>
  )
}

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  return (
    <motion.div
      key={pathname}
      layoutId={pathname}
      initial='pageInitial'
      animate='pageAnimate'
      exit='pageExit'
      variants={{
        pageInitial: { opacity: 0, y: 20 },
        pageAnimate: { opacity: 1, y: 0 },
        pageExit: { opacity: 0, y: -20 }
      }}
      transition={{
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.5
      }}
    >
      <main>{children}</main>
    </motion.div>
  )
}
