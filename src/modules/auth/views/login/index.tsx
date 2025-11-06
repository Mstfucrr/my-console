'use client'
import CustomImage from '@/components/image'
import { SiteLogoMin } from '@/components/svg'
import LogInForm from '@/modules/auth/components/login-form'
import VerfiyForm from '@/modules/auth/components/verify-form'
import { useAuthContext } from '@/modules/auth/context/AuthContext'

const LoginFormContent = () => {
  const { isOtp } = useAuthContext()
  if (isOtp) return <VerfiyForm />
  return <LogInForm />
}

export function LoginView() {
  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden'>
      <CustomImage
        src='/images/auth/auth3-light.png'
        alt='background image'
        className='absolute top-0 left-0 h-full w-full'
      />
      <div className='bg-background relative z-10 m-4 w-full max-w-xl rounded-xl p-4 py-5 sm:p-10 xl:p-12 2xl:p-14'>
        <div className='flex w-full items-center gap-2'>
          <SiteLogoMin className='text-primary size-12 sm:size-20 md:size-24' />
          <span className='text-default-900 text-lg font-bold sm:text-2xl md:text-3xl'>
            <b className='text-primary'>Partner&apos;a</b> Hoşgeldiniz
          </span>
        </div>
        <LoginFormContent />
      </div>
    </div>
  )
}
