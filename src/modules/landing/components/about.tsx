'use client'

import { Target, Rocket, Cpu } from 'lucide-react'
import { Reveal } from './reveal'

const cards = [
  {
    icon: Target,
    iconBg: 'bg-primary-pink-50 text-primary-pink',
    title: 'Misyonumuz',
    desc: 'fiyuu kurye ağı üzerinde işletmelerin sipariş ve teslimat operasyonlarını kolaylaştırmak.'
  },
  {
    icon: Rocket,
    iconBg: 'bg-primary-50 text-primary',
    title: 'Vizyonumuz',
    desc: "Türkiye'nin en güvenilir işletme yönetim platformu olarak her ölçekteki markaya ulaşmak."
  },
  {
    icon: Cpu,
    iconBg: 'bg-secondary text-secondary-foreground',
    title: 'Teknoloji',
    desc: 'Anlık sipariş takibi, online mutabakat ve akıllı raporlama ile operasyonlarınızı dijitalleştiriyoruz.'
  }
]

const stats = [
  { num: '500', suffix: '+', label: 'Aktif İşletme' },
  { num: '5', suffix: 'dk', label: 'Ortalama Başvuru' },
  { num: '40', suffix: '+', label: 'POS Entegrasyonu' }
]

export function About() {
  return (
    <section id='hakkimizda' className='relative overflow-hidden py-20 md:py-28 snap-start'>
      {/* decorative blob */}
      <div className='bg-primary-50 pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full opacity-50 blur-3xl' />

      <div className='mx-auto grid max-w-6xl items-center gap-16 px-4 md:grid-cols-2 md:px-6'>
        {/* LEFT */}
        <div>
          <Reveal>
            <span className='bg-primary-50 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase'>
              ✦ Hakkımızda
            </span>
            <h2 className='font-heading mt-4 text-primary-600 text-3xl font-extrabold tracking-tight text-balance md:text-4xl'>
              fiyuu Partner ile
              <br />
              operasyonlarınızı <span className='text-primary-pink'>tek yerden</span> yönetin
            </h2>
            <p className='text-muted-foreground mt-4 max-w-md text-sm leading-relaxed text-pretty md:text-base'>
              fiyuu Partner, fiyuu kurye ağı üzerinde işletmelerin sipariş, kurye takibi, mutabakat ve raporlama
              ihtiyaçlarını karşılayan yönetim platformudur. Restoranlardan market zincirlerine kadar her ölçekteki
              işletmeye özel çözümler sunuyoruz.
            </p>
          </Reveal>

          {/* Stats */}
          <Reveal delay={0.1}>
            <div className='mt-8 grid grid-cols-3 gap-4'>
              {stats.map(s => (
                <div key={s.label} className='border-border bg-background rounded-2xl border p-4'>
                  <p className='font-heading text-foreground text-2xl font-extrabold md:text-3xl'>
                    {s.num}
                    <span className='text-primary-pink'>{s.suffix}</span>
                  </p>
                  <p className='text-muted-foreground mt-1 text-xs'>{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Pills */}
          <Reveal delay={0.18}>
            <div className='mt-5 flex flex-wrap gap-2'>
              {['5 Dakikada Başvuru', 'Anlık Sipariş Takibi', '7/24 Destek'].map(t => (
                <span
                  key={t}
                  className='border-border bg-background text-foreground flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold'
                >
                  <span className='bg-primary h-1.5 w-1.5 rounded-full' />
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* RIGHT: cards */}
        <div className='flex flex-col gap-4'>
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1} direction='right'>
              <div className='group border-border bg-background hover:border-primary/30 flex gap-4 rounded-3xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md'>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${c.iconBg}`}>
                  <c.icon className='h-5 w-5' />
                </div>
                <div>
                  <h3 className='font-heading text-foreground text-sm font-bold'>{c.title}</h3>
                  <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>{c.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
