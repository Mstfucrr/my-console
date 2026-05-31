'use client'

import { Building2, MapPin, Clock } from 'lucide-react'
import { Reveal } from './reveal'
import CustomImage from '@/components/image'

const steps = [
  {
    icon: Building2,
    num: '01',
    title: 'İşletme Bilgileri',
    desc: 'Şirket bilgilerinizi girerek başvurunuzu başlatın.'
  },
  {
    icon: Building2,
    num: '02',
    title: 'Şube Bilgileri',
    desc: 'Şubenizin ad, iletişim ve diğer bilgilerini ekleyin.'
  },
  {
    icon: MapPin,
    num: '03',
    title: 'Konum Bilgileri',
    desc: 'Şubenizin konum bilgilerini harita üzerinden belirleyin.'
  },
  {
    icon: Clock,
    num: '04',
    title: 'Çalışma Saatleri',
    desc: 'Çalışma saatlerinizi belirleyin, başvurunuzu tamamlayın ve panelden yönetmeye başlayın.'
  }
]

export function HowItWorks() {
  return (
    <section id='nasil-calisir' className='bg-secondary/30 snap-start px-4 py-20 md:px-6 md:py-28'>
      <div className='mx-auto max-w-6xl'>
        <div className='grid items-center gap-14 md:grid-cols-2'>
          {/* Illustration */}
          <Reveal direction='left'>
            <div className='relative mx-auto max-w-sm'>
              <div className='bg-primary-50 pointer-events-none absolute inset-0 rounded-3xl opacity-60 blur-2xl' />
              <CustomImage
                src='/images/landing/chef.png'
                alt='Şef yemek hazırlıyor'
                className='relative mx-auto w-full rounded-3xl'
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </Reveal>

          {/* Steps */}
          <div>
            <Reveal>
              <span className='text-primary text-sm font-semibold tracking-wider uppercase'>Nasıl Çalışır</span>
              <h2 className='font-heading mt-3 text-primary-600 text-3xl font-extrabold tracking-tight text-balance md:text-4xl'>
                Başvuru için sadece
                <br />4 kolay adım
              </h2>
              <p className='text-muted-foreground mt-3 text-sm leading-relaxed md:text-base'>
                Ortalama 5 dakika içinde tamamlayabileceğiniz başvuru süreciyle fiyuu Partner ailesine katılın.
              </p>
            </Reveal>

            {/* connecting line + steps */}
            <div className='relative mt-10 flex flex-col gap-0'>
              {/* vertical dashed line */}
              <div className='border-primary/25 pointer-events-none absolute top-6 left-6 h-[calc(100%-5rem)] w-px border-l-2 border-dashed' />

              {steps.map((s, i) => (
                <Reveal key={s.num} delay={i * 0.1}>
                  <div className='group flex gap-5 pb-8 last:pb-0'>
                    {/* icon circle */}
                    <div className='border-primary-100 bg-background group-hover:border-primary group-hover:bg-primary-50 relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition-all'>
                      <s.icon className='text-primary h-5 w-5' />
                    </div>
                    <div className='pt-1'>
                      <p className='font-heading text-primary text-xs font-bold'>{s.num}</p>
                      <h3 className='font-heading text-foreground text-base font-bold'>{s.title}</h3>
                      <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
