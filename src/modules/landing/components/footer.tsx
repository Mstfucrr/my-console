import { SiteLogoBig } from '@/components/svg'

const groups = [
  { title: 'Şirket', links: ['Hakkımızda', 'Kariyer', 'Basın', 'Blog'] },
  { title: 'Ürün', links: ['Özellikler', 'Fiyatlandırma', 'Demo', 'Güncellemeler'] },
  { title: 'Destek', links: ['Yardım Merkezi', 'İletişim', 'SSS', 'Kurye Ol'] },
  { title: 'Yasal', links: ['Gizlilik', 'Kullanım Koşulları', 'Çerezler'] }
]

export function Footer() {
  return (
    <footer className='border-border bg-secondary/20 border-t snap-start'>
      <div className='mx-auto max-w-6xl px-4 py-14 md:px-6'>
        <div className='grid gap-10 md:grid-cols-[1.8fr_repeat(4,1fr)]'>
          <div>
            <a href='#hero' className='inline-flex'>
              <SiteLogoBig className='text-primary h-11 w-auto' aria-hidden />
            </a>
            <p className='text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed'>
              fiyuu&apos;nun işletme yönetim platformu. Sipariş, kurye takibi, mutabakat ve raporlama tek panelde.
            </p>
            <p className='text-muted-foreground mt-3 text-sm'>
              Destek:{' '}
              <a href='tel:08508006061' className='text-primary hover:text-primary-700 font-semibold transition-colors'>
                0850 800 6061
              </a>
            </p>
            <div className='mt-5 flex gap-3'>
              {['Twitter', 'Instagram', 'LinkedIn'].map(s => (
                <a
                  key={s}
                  href='#'
                  className='border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-colors'
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {groups.map(g => (
            <div key={g.title}>
              <h4 className='font-heading text-foreground text-sm font-bold'>{g.title}</h4>
              <ul className='mt-4 flex flex-col gap-2.5'>
                {g.links.map(l => (
                  <li key={l}>
                    <a href='#' className='text-muted-foreground hover:text-primary text-sm transition-colors'>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='border-border text-muted-foreground mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm sm:flex-row'>
          <p>© {new Date().getFullYear()} fiyuu Partner. Tüm hakları saklıdır.</p>
          <p>🇹🇷 Türkiye&apos;de geliştirildi</p>
        </div>
      </div>
    </footer>
  )
}
