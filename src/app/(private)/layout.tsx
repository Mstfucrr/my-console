'use client'
import LayoutLoader from '@/components/layout-loader'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { useMounted } from '@/hooks/use-mounted'
import { TopbarAndMobileMenu } from '@/modules/menu'
import { motion } from 'framer-motion'
// import 'leaflet/dist/leaflet.css'
import { usePathname, useRouter } from 'next/navigation'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { useEffect } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const mounted = useMounted()

  if (!mounted) return <LayoutLoader />

  return (
    <AuthProvider>
      <AuthGuard>
        <TopbarAndMobileMenu />
        <div className='pt-12 pb-24 transition-all duration-150 lg:pt-16 lg:pb-16'>
          <div className='flex flex-col gap-4 pb-0'>
            <LayoutWrapper>
              <NuqsAdapter>
                <div className='container mx-auto'>{children}</div>
              </NuqsAdapter>
            </LayoutWrapper>
          </div>
        </div>
      </AuthGuard>
    </AuthProvider>
  )
}

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (pathname !== '/login' && pathname !== '/forgot-password' && pathname !== '/reset-password') {
        router.push('/login')
      }
    }
  }, [isAuthenticated, isLoading, router, pathname])

  if (isLoading) {
    return <LayoutLoader />
  }

  if (!isAuthenticated) {
    return <LayoutLoader />
  }

  return <>{children}</>
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
