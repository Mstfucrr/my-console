'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal } from './reveal'

const faqs = [
  {
    q: "fiyuu Partner'a nasıl başvurabilirim?",
    a: "Ana sayfadaki 'fiyuu İşletmesi Ol' butonuna tıklayarak başvuru formunu doldurabilirsiniz. Ortalama 5 dakika içinde tamamlanan 4 adımlık süreçle işletme bilgilerinizi, şube detaylarınızı, konum ve çalışma saatlerinizi girebilirsiniz."
  },
  {
    q: 'Başvuru onay süreci ne kadar sürer?',
    a: 'Başvurunuz incelendikten sonra genellikle 24 saat içinde sonuçlandırılır. Onay sonrası Partner panelinize giriş yaparak sipariş ve operasyon yönetimine başlayabilirsiniz.'
  },
  {
    q: 'Partner panelinde neler yapabilirim?',
    a: 'Siparişlerinizi anlık takip edebilir, kurye konumunu izleyebilir, online mutabakat süreçlerinizi yönetebilir ve detaylı raporları görüntüleyebilirsiniz. Çoklu şube yönetimi de desteklenmektedir.'
  },
  {
    q: 'Mutabakat süreçleri nasıl işliyor?',
    a: 'fiyuu Partner panelinde mutabakat dönemlerinizi online olarak görüntüleyebilir, onaylayabilir ve geçmiş dönem kayıtlarınıza erişebilirsiniz. Raporlarınızı anlık olarak indirebilir veya e-posta ile alabilirsiniz.'
  },
  {
    q: 'Destek hattına nasıl ulaşabilirim?',
    a: '7/24 destek ekibimize 0850 800 6061 numaralı telefon hattından veya Partner paneli içindeki canlı destek özelliğinden ulaşabilirsiniz.'
  }
]

function FaqItem({ faq, index }: { faq: (typeof faqs)[0]; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <Reveal delay={index * 0.06}>
      <div className='border-border border-b last:border-0'>
        <button
          onClick={() => setOpen(v => !v)}
          className='flex w-full items-center justify-between gap-4 py-5 text-left'
        >
          <span className='font-heading text-foreground text-sm font-semibold md:text-base'>{faq.q}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className='text-muted-foreground shrink-0'
          >
            <ChevronDown className='h-5 w-5' />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className='overflow-hidden'
            >
              <p className='text-muted-foreground pb-5 text-sm leading-relaxed'>{faq.a}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  )
}

export function Faq() {
  return (
    <section id='sss' className='mx-auto max-w-3xl px-4 py-20 md:px-6 md:py-28 snap-start'>
      <Reveal className='text-center'>
        <span className='text-primary text-sm font-semibold tracking-wider uppercase'>SSS</span>
        <h2 className='font-heading mt-3 text-3xl font-extrabold text-primary-600 tracking-tight text-balance md:text-4xl'>
          Sıkça sorulan sorular
        </h2>
      </Reveal>

      <div className='border-border bg-background mt-12 rounded-3xl border p-6 md:p-8'>
        {faqs.map((f, i) => (
          <FaqItem key={i} faq={f} index={i} />
        ))}
      </div>
    </section>
  )
}
