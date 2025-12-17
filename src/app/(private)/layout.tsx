'use client'
import LayoutLoader from '@/components/layout-loader'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ProfileProvider, useProfile } from '@/context/ProfileProvider'
import { OrderStatusWebSocketProvider } from '@/context/useOrderStatusWebSocket'
import { useMounted } from '@/hooks/use-mounted'
import { usePermission } from '@/hooks/use-permission'
import { TopbarAndMobileMenu } from '@/modules/menu'
import { motion } from 'framer-motion'
// import 'leaflet/dist/leaflet.css'
import { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { useEffect } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const mounted = useMounted()

  if (!mounted) return <LayoutLoader />

  return (
    <AuthProvider>
      <AuthGuard>
        <ProfileProvider>
          <ProfileGuard>
            <WebSocketProvider>
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
            </WebSocketProvider>
          </ProfileGuard>
        </ProfileProvider>
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

  if (isLoading || !isAuthenticated) return <LayoutLoader />

  return <>{children}</>
}

const ProfileGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useProfile()
  const pathname = usePathname()
  const router = useRouter()
  const { checkRoute, firstAllowedRoute } = usePermission()

  useEffect(() => {
    if (isLoading || !pathname) return
    if (checkRoute(pathname as Route)) return
    if (pathname === firstAllowedRoute) return
    router.replace(firstAllowedRoute)
  }, [pathname, isLoading, checkRoute, firstAllowedRoute, router])

  if (isLoading || !checkRoute(pathname as Route)) return <LayoutLoader />

  return children
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

const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  return <OrderStatusWebSocketProvider>{children}</OrderStatusWebSocketProvider>
}
