'use client'
import CustomImage from '@/components/image'
import { SiteLogoBig } from '@/components/svg'
import { Button } from '@/components/ui/button'
import { isActiveTenant } from '@/lib/permissions'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const OnboardingProvider = dynamic(
  () => import('@/modules/tenant/onboarding/context/OnboardingContext').then(mod => mod.OnboardingProvider),
  {
    ssr: false,
    loading: () => <div className='flex size-full min-h-[200px] items-center justify-center' />
  }
)

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'
  const isInOnboardingPage = pathname.startsWith('/onboarding')
  const router = useRouter()

  useEffect(() => {
    if (isActiveTenant || pathname !== '/onboarding') return
    toast.warning(
      'Şuan teknik bakım nedeniyle işletme başvurusu kabul edilmemektedir. Lütfen daha sonra tekrar deneyiniz.',
      { autoClose: 4000 }
    )
    router.replace('/login')
  }, [router, pathname])

  return (
    <div className='relative flex h-screen w-full flex-col overflow-hidden bg-linear-to-br from-blue-50/40 to-indigo-100/50'>
      {/* topbar */}
      <div className='top-0 z-10 w-full bg-linear-to-br from-blue-50/40 to-indigo-100/50 shadow-sm backdrop-blur-xl md:fixed'>
        <div className='container mx-auto flex h-16 items-center gap-4 px-4'>
          <SiteLogoBig className='text-primary w-32' />
          {isActiveTenant && (
            <div className='ml-auto flex items-center'>
              <Link href='/onboarding'>
                <Button size='sm' color='primary-pink'>
                  fiyuu İşletmesi Ol
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className='flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row'>
        <div className='relative top-0 w-full flex-auto max-md:hidden sm:sticky md:h-screen md:w-[65%] md:shrink-0 md:self-start'>
          <CustomImage src='/images/home/bg-image.png' alt='logo' className='size-full h-full w-full object-cover' />
          <div className='bg-primary/70 absolute -bottom-5 left-1/2 flex items-center justify-center rounded-4xl p-3.5 shadow-lg max-md:-translate-x-1/2 md:bottom-1/4 md:left-20 md:p-10 xl:p-14'>
            <span className='text-sm font-bold text-nowrap text-white md:text-2xl xl:text-4xl'>
              fiyuu ile Markanızı <br className='hidden md:block' /> Birlikte Büyütelim
            </span>
          </div>
        </div>
        <div className='flex w-full flex-auto flex-col items-center justify-between gap-5 md:w-[45%]'>
          <OnboardingProvider>
            <div className='flex size-full min-h-min flex-col items-center pt-10 pb-5 md:pt-28'>
              <div className='flex w-full max-w-sm flex-col gap-4 px-5'>{children}</div>
            </div>
          </OnboardingProvider>
          {!isLoginPage && isInOnboardingPage && (
            <span className='text-muted-foreground text-sm font-medium'>
              Zaten hesabınız var mı?{' '}
              <Link href='/login' className='text-primary hover:text-primary-700 font-medium underline'>
                Giriş Yap
              </Link>
            </span>
          )}
          {isLoginPage && isActiveTenant && (
            <div className='bg-primary-pink/10 rounded-md px-2 py-1 text-sm font-medium text-black'>
              fiyuu işletmesi değil misin?{' '}
              <Link
                href='/onboarding'
                className='text-primary-pink hover:text-primary-pink-700 font-bold underline transition-colors'
              >
                fiyuu İşletmesi Ol
              </Link>
            </div>
          )}
          <div className='bg-primary text-muted flex w-full items-center justify-center gap-2 px-6 py-6 text-sm sm:px-12 xl:px-36'>
            <span>
              Sisteme giriş yaparken bir sorun ile karşılaşıyorsanız lütfen{' '}
              <a href='tel:08508006061' className='underline'>
                <b className='hover:text-white-700 text-white'>0850 800 6061</b>
              </a>{' '}
              numaralı iletişim hattı ile irtibata geçiniz.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
