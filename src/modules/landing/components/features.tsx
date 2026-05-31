'use client'

import { CreditCard, Clock, LineChart, MessageCircle, ShieldCheck, Building2 } from 'lucide-react'
import { Reveal } from './reveal'

const features = [
  {
    icon: CreditCard,
    title: 'Şuben İçin Akıllı Sipariş Çözümü',
    desc: 'Şubelerinize özel web sitesi ile siparişlerinizi oluşturun ve yönetin.'
  },
  {
    icon: Clock,
    title: 'Sipariş & Kurye Takip',
    desc: 'Siparişlerinizi anlık görüntüleyin, kurye takibini tek ekrandan yapın.'
  },
  {
    icon: LineChart,
    title: 'Online Mutabakat & Raporlama',
    desc: 'Mutabakat süreçlerinizi online yönetin, raporlarınızı anlık görüntüleyin.'
  },
  {
    icon: MessageCircle,
    title: 'Müşteri Hizmetleri Anında Yanınızda',
    desc: 'Canlı destek ile sorunlarınızı anında çözün.'
  },
  {
    icon: ShieldCheck,
    title: 'Güvenli Altyapı',
    desc: '256-bit SSL şifreleme ile işletme ve müşteri verileri her zaman güvende.'
  },
  {
    icon: Building2,
    title: 'Çoklu Şube Yönetimi',
    desc: 'Tüm şubelerinizi tek panelden yönetin, başvurularınızı takip edin.'
  }
]

export function Features() {
  return (
    <section id='ozellikler' className='py-20 md:py-28 snap-start bg-secondary/30'>
      <div className='mx-auto max-w-6xl px-4 md:px-6'>
        <Reveal className='mx-auto max-w-2xl text-center'>
          <span className='text-primary text-sm font-semibold tracking-wider uppercase'>Özellikler</span>
          <h2 className='font-heading mt-3 text-primary-600 text-3xl font-extrabold tracking-tight text-balance md:text-4xl'>
            Tüm operasyonlarınız
            <br />
            tek panelde
          </h2>
          <p className='text-muted-foreground mt-4 leading-relaxed text-pretty'>
            fiyuu Partner, işletmenizin sipariş, teslimat, mutabakat ve raporlama ihtiyaçlarını karşılamak için
            tasarlandı.
          </p>
        </Reveal>

        <div className='mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.08}>
              <div className='group border-border bg-background hover:border-primary/40 hover:shadow-primary/5 h-full rounded-3xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg'>
                <div className='bg-primary-50 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex h-11 w-11 items-center justify-center rounded-2xl transition-all'>
                  <f.icon className='h-5 w-5' />
                </div>
                <h3 className='font-heading text-foreground mt-4 text-base font-bold'>{f.title}</h3>
                <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
