'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Clock, MapPin } from 'lucide-react'
import { SiteLogoBig } from '@/components/svg'
import { Button } from '@/components/ui/button'
import { MotionCustomImage } from '@/components/image'

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const }
  })
}

export function Hero() {
  return (
    <section id='hero' className='bg-default-50 relative overflow-hidden pt-24 md:pt-28 snap-start'>
      <SiteLogoBig
        className='text-primary pointer-events-none absolute top-28 right-0 size-48 opacity-[0.06] md:top-32 md:right-1/2 md:size-96'
        aria-hidden
      />
      {/* bg glows */}
      <div className='bg-primary-50 pointer-events-none absolute top-20 -left-32 h-80 w-80 rounded-full opacity-70 blur-3xl' />
      <div className='bg-primary-pink-50 pointer-events-none absolute top-32 -right-20 h-96 w-96 rounded-full opacity-40 blur-3xl' />

      <div className='mx-auto grid max-w-6xl items-center gap-8 px-4 pb-16 md:grid-cols-2 md:gap-6 md:px-6'>
        {/* LEFT — copy */}
        <div className='relative z-10'>
          <motion.span
            custom={0}
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            className='border-border bg-background text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium shadow-sm'
          >
            <span className='bg-primary-pink h-2 w-2 animate-pulse rounded-full' />
            fiyuu Partner — işletme yönetim platformu
          </motion.span>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            className='font-heading mt-5 text-4xl text-primary-600 leading-[1.08] font-extrabold tracking-tight text-balance sm:text-5xl md:text-[3.4rem]'
          >
            İşletmenizi
            <br />
            Birlikte <span className='text-primary-pink'>Büyütelim</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            className='text-muted-foreground mt-5 max-w-md text-base leading-relaxed text-pretty md:text-lg'
          >
            <strong className='text-primary'>fiyuu Partner</strong> ile siparişlerinizi yönetin, kurye takibini yapın,
            mutabakat ve raporları tek panelden takip edin. fiyuu kurye ağı yanınızda.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            className='mt-7 flex flex-col gap-3 sm:flex-row'
          >
            <Button color='primary' size='xl' asChild>
              <Link href='/login'>Giriş Yap →</Link>
            </Button>
            <Button color='primary-pink' variant='outline' size='xl' asChild>
              <Link href='/onboarding'>fiyuu İşletmesi Ol</Link>
            </Button>
          </motion.div>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            className='text-muted-foreground mt-8 flex flex-wrap items-center gap-6 text-sm'
          >
            {[
              {
                icon: Star,
                text: (
                  <>
                    <strong className='text-foreground'>500+</strong> Aktif İşletme
                  </>
                )
              },
              {
                icon: Clock,
                text: (
                  <>
                    <strong className='text-foreground'>5 dk</strong> Ortalama başvuru
                  </>
                )
              },
              {
                icon: MapPin,
                text: (
                  <>
                    <strong className='text-foreground'>40+</strong> Şehir
                  </>
                )
              }
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className='flex items-center gap-1.5'>
                <Icon className='text-primary h-4 w-4' />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — hero illustration */}
        <div className='relative z-10 flex items-center justify-center'>
          {/* dot grid decoration */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='pointer-events-none absolute -top-4 left-10 z-0 grid gap-1.5'
            style={{ gridTemplateColumns: 'repeat(4,1fr)' }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className='bg-primary block h-1.5 w-1.5 rounded-full'
                style={{ opacity: i > 7 ? 0.1 : 0.28 }}
              />
            ))}
          </motion.div>

          {/* deco ring */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='border-primary/20 pointer-events-none absolute bottom-16 -left-6 z-0 h-12 w-12 rounded-full border-2'
          />

          <MotionCustomImage
            src='/images/landing/hero.png'
            alt='fiyuu Partner teslimat süreci'
            className='relative w-full max-w-lg object-contain'
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          {/* floating badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className='border-border bg-background/90 absolute -right-2 bottom-20 hidden rounded-2xl border p-3 shadow-lg backdrop-blur-md sm:block md:-right-6'
          >
            <p className='text-muted-foreground text-xs'>Bugün teslim edildi</p>
            <p className='font-heading text-primary text-sm font-bold'>+1.240 sipariş</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
