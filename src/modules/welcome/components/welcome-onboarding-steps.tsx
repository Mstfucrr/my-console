'use client'

import CustomImage from '@/components/image'
import { cn } from '@/lib/utils'
import { APPLICATION_STEPS, INTRO_STATS, PARTNER_FEATURES } from '@/modules/welcome/constants'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { WelcomeFinancialForm } from './welcome-financial-form'

function WelcomeStepHeading({
  title,
  description,
  titleClassName
}: {
  title: ReactNode
  description: ReactNode
  titleClassName?: string
}) {
  return (
    <div className='text-center lg:text-left'>
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={cn('text-primary text-2xl font-bold tracking-tight max-sm:text-xl/7', titleClassName)}
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className='text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base'
      >
        {description}
      </motion.p>
    </div>
  )
}

function WelcomeStepLayout({
  imageSrc,
  imageAlt,
  children
}: {
  imageSrc: string
  imageAlt: string
  children: ReactNode
}) {
  return (
    <div className='flex flex-col gap-4 sm:gap-8 md:flex-row md:items-center md:gap-12'>
      <div className='order-2 flex basis-7/12 flex-col gap-4 md:order-1'>{children}</div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className='order-1 flex basis-5/12 justify-center max-md:max-h-48 md:order-2 md:justify-end md:pr-10'
      >
        <CustomImage
          src={imageSrc}
          alt={imageAlt}
          className='h-full max-h-[470px] w-auto object-contain max-md:max-h-[inherit]'
        />
      </motion.div>
    </div>
  )
}

export function WelcomeStepIntro() {
  return (
    <WelcomeStepLayout imageSrc='/images/welcome/Image-1.png' imageAlt='Welcome Step Intro'>
      <WelcomeStepHeading
        titleClassName='sm:text-3xl'
        title={"fiyuu'ya Hoş Geldin"}
        description='fiyuu ile markanızı birlikte büyütelim. Bu kısa turda, markanızı binlerce müşteriye ulaştıracak platformumuzu ve başvuru sürecini keşfedin.'
      />
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className='divide-border border-border grid grid-cols-2 divide-x divide-y overflow-hidden rounded-xl border sm:grid-cols-4'
      >
        {INTRO_STATS.map(item => (
          <div
            key={item.label}
            className='bg-primary/90 flex flex-col items-center gap-1 px-2 py-2 text-center sm:px-3 sm:py-4'
          >
            <span className='text-primary-foreground text-lg font-bold sm:text-2xl'>{item.value}</span>
            <span className='text-muted text-[11px] leading-tight sm:text-xs'>{item.label}</span>
          </div>
        ))}
      </motion.div>
    </WelcomeStepLayout>
  )
}

export function WelcomeStepPartner() {
  return (
    <WelcomeStepLayout imageSrc='/images/welcome/Image-2.png' imageAlt='Welcome Step Partner'>
      <WelcomeStepHeading
        titleClassName='sm:text-3xl'
        title='Tüm Operasyonların Tek Yerde'
        description="Şube başvuru adımlarını tamamla. fiyuu'nun kurye ağıyla teslimatları hızlı ve güvenli şekilde biz yönetelim."
      />
      <ul className='flex flex-col gap-4'>
        {PARTNER_FEATURES.map(({ icon: Icon, ...item }, index) => (
          <motion.li
            key={item.title}
            className='flex gap-3'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
          >
            <div
              className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', item.boxClass)}
              aria-hidden
            >
              <Icon className='size-5' />
            </div>
            <div className='min-w-0'>
              <p className='text-foreground text-sm font-semibold sm:text-base'>{item.title}</p>
              <p className='text-muted-foreground mt-0.5 text-xs sm:text-sm'>{item.description}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </WelcomeStepLayout>
  )
}

export function WelcomeStepApplication() {
  return (
    <WelcomeStepLayout imageSrc='/images/welcome/Image-3.png' imageAlt='Welcome Step Application'>
      <WelcomeStepHeading
        titleClassName='sm:text-3xl'
        title='Başvuru İçin Sadece 4 Adım'
        description='Ortalama 5 dakika içinde tamamlayabileceğiniz kolay bir süreç.'
      />
      <ol className='flex flex-col'>
        {APPLICATION_STEPS.map((item, index) => (
          <motion.li
            key={item.title}
            className='flex gap-4'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
          >
            <div className='flex flex-col items-center self-stretch'>
              <span className='bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold'>
                {index + 1}
              </span>
              {index < APPLICATION_STEPS.length - 1 && (
                <span className='bg-border mt-1 min-h-4 w-0.5 flex-1' aria-hidden />
              )}
            </div>
            <div className='min-w-0 flex-1 pt-0.5 pb-3 md:pb-4'>
              <p className='text-foreground font-semibold'>{item.title}</p>
              <p className='text-muted-foreground mt-1 text-sm'>{item.description}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </WelcomeStepLayout>
  )
}

export function WelcomeStepBusinessInfo() {
  return <WelcomeFinancialForm />
}
