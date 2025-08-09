'use client'

import AnimatedLogo from '@/components/animated-logo'
import DecorativeAccents from './components/DecorativeAccents'
import WelcomeText from './components/WelcomeText'

export default function HomeView() {
  return (
    <div className='bg-background relative min-h-screen overflow-hidden'>
      {/* Main Content */}
      <div className='relative z-10 flex min-h-screen flex-col items-center justify-center px-4 max-sm:justify-start max-sm:pt-20'>
        {/* Logo */}
        <AnimatedLogo />

        {/* Welcome Text and Subtitle */}
        <WelcomeText />
      </div>

      {/* Decorative Polygon Accents */}
      <DecorativeAccents />
    </div>
  )
}
