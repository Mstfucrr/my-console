'use client'

import { motion } from 'framer-motion'
import { Reveal } from './reveal'
import { SiteLogoNoText } from '@/components/svg'
import Link from 'next/link'
import CustomImage from '@/components/image'

export function Cta() {
  return (
    <section className='mx-auto max-w-6xl snap-start px-4 pb-24 md:px-6'>
      <div className='bg-primary-pink relative overflow-hidden rounded-[2.5rem] px-6 py-14 text-white md:px-16 md:py-20'>
        <SiteLogoNoText
          className='pointer-events-none absolute -right-6 -bottom-6 h-40 w-40 text-white opacity-10'
          aria-hidden
        />
        {/* animated bg blobs */}
        <motion.div
          aria-hidden
          className='pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10'
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className='pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-white/10'
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className='relative z-10 grid items-center gap-8 md:grid-cols-[1fr_auto]'>
          <div className='max-w-xl'>
            <Reveal>
              <h2 className='font-heading text-3xl font-extrabold tracking-tight text-balance md:text-4xl lg:text-5xl'>
                fiyuu Partner ailesine
                <br />
                bugün katılın
              </h2>
              <p className='mt-4 leading-relaxed text-pretty text-white/85 md:text-lg'>
                Siparişlerinizi dijitalleştirin, fiyuu kurye ağıyla teslimatlarınızı hızlandırın ve tüm
                operasyonlarınızı tek panelden yönetin.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                <Link
                  href='/onboarding'
                  className='bg-background text-primary hover:bg-background/90 rounded-xl px-7 py-3.5 text-center text-base font-bold transition-all hover:-translate-y-0.5'
                >
                  fiyuu İşletmesi Ol →
                </Link>
                <Link
                  href='/login'
                  className='rounded-xl border border-white/30 px-7 py-3.5 text-center text-base font-bold text-white transition-all hover:bg-white/10'
                >
                  Giriş Yap
                </Link>
              </div>
            </Reveal>
          </div>

          {/* illustration */}
          <Reveal direction='right'>
            <div className='hidden md:block'>
              <CustomImage
                src='/images/landing/delivery.png'
                alt='Teslimat'
                className='w-60 lg:w-72'
                style={{ mixBlendMode: 'luminosity', opacity: 0.9 }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
