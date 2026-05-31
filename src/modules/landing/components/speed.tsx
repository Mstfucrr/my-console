'use client'

import { Reveal } from './reveal'
import { MotionCustomImage } from '@/components/image'

const stats = [
  { value: '5 dk', label: 'Ortalama başvuru süresi' },
  { value: '4', label: 'Kolay adım' },
  { value: '7/24', label: 'Canlı destek' },
  { value: '40+', label: 'POS firması ile entegre' }
]

export function Speed() {
  return (
    <section className='mx-auto px-4 bg-secondary/30 py-20 md:px-6 md:py-28 snap-start'>
      <div className='max-w-6xl mx-auto'>

      <div className='border-border bg-secondary/40 relative overflow-hidden rounded-[2.5rem] border px-6 py-12 md:px-12'>
        <div className='grid items-center gap-10 md:grid-cols-2'>
          {/* Text + stats */}
          <div>
            <Reveal>
              <span className='text-primary text-sm font-semibold tracking-wider uppercase'>
                Rakamlarla fiyuu Partner
              </span>
              <h2 className='font-heading mt-3 text-primary-600 text-3xl font-extrabold tracking-tight text-balance md:text-4xl'>
                İşletmeniz için tasarlandı
              </h2>
              <p className='text-muted-foreground mt-4 max-w-md leading-relaxed text-pretty'>
                fiyuu kurye ağı ve Partner paneli ile operasyonlarınızı hızlandırın, büyümeye odaklanın.
              </p>
            </Reveal>

            <div className='mt-8 grid grid-cols-2 gap-4'>
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.07}>
                  <div className='border-border bg-background rounded-2xl border p-4'>
                    <p className='font-heading text-primary text-2xl font-extrabold md:text-3xl'>{s.value}</p>
                    <p className='text-muted-foreground mt-1 text-sm'>{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className='relative flex items-center justify-center'>
            <div className='bg-primary-50/50 pointer-events-none absolute inset-0 rounded-3xl blur-3xl' />
            <MotionCustomImage
              src='/images/landing/courier.png'
              alt='Teslimat kuryesi'
              className='relative mx-auto w-full max-w-sm'
              style={{ mixBlendMode: 'multiply' }}
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ amount: 0.4 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
