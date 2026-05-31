'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Menu, X } from 'lucide-react'
import { SiteLogoBig } from '@/components/svg'
import { Button } from '@/components/ui/button'

const SCROLL_ROOT_ID = 'main'

const links = [
  { label: 'Ana Sayfa', href: '#hero' },
  { label: 'Nasıl Çalışır', href: '#nasil-calisir' },
  { label: 'Hakkımızda', href: '#hakkimizda' },
  { label: 'Özellikler', href: '#ozellikler' },
  { label: 'SSS', href: '#sss' }
]

function getScrollRoot() {
  return document.getElementById(SCROLL_ROOT_ID)
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('hero')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const root = getScrollRoot()
    if (!root) return

    const onScroll = () => setScrolled(root.scrollTop > 20)
    onScroll()

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { root, threshold: 0.45 }
    )

    links.forEach(l => {
      const el = document.getElementById(l.href.slice(1))
      if (el) obs.observe(el)
    })

    root.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      root.removeEventListener('scroll', onScroll)
      obs.disconnect()
    }
  }, [])

  function scrollTo(href: string) {
    const root = getScrollRoot()
    const target = document.querySelector<HTMLElement>(href)
    if (!root || !target) return

    root.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className='fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3'
      >
        <div
          className={`flex w-full max-w-5xl items-center justify-between rounded-2xl border px-5 py-3 transition-all duration-300 ${
            scrolled
              ? 'border-border/80 bg-background/90 shadow-sm backdrop-blur-lg'
              : 'border-transparent bg-transparent'
          }`}
        >
          {/* Logo */}
          <button onClick={() => scrollTo('#hero')} className='flex items-center' aria-label='Ana sayfa'>
            <SiteLogoBig className='text-primary h-9 w-auto' aria-hidden />
          </button>

          <AnimatePresence mode='popLayout' initial={false}>
            {/* Desktop links */}
            <motion.nav
              layoutId='navbar-links'
              key='navbar-links'
              className='mx-auto hidden items-center gap-7 md:flex'
            >
              {links.map(l => (
                <button
                  key={l.href}
                  onClick={() => scrollTo(l.href)}
                  className={`relative text-sm font-medium transition-colors ${
                    active === l.href.replace('#', '') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {l.label}
                  {active === l.href.replace('#', '') && (
                    <motion.span
                      layoutId='nav-link-active'
                      className='bg-primary absolute -bottom-1 left-1/2 h-1 w-full -translate-x-1/2 rounded-full'
                    />
                  )}
                </button>
              ))}
            </motion.nav>

            {/* Desktop CTA */}
            {scrolled && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key='navbar-cta'
                className='hidden items-center gap-2 md:flex'
              >
                <Button variant='ghost' size='md' asChild>
                  <Link href='/login'>Giriş Yap</Link>
                </Button>
                <Button color='primary-pink' size='md' asChild>
                  <Link href='/onboarding'>fiyuu İşletmesi Ol</Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(v => !v)}
            className='bg-secondary text-secondary-foreground flex h-9 w-9 items-center justify-center rounded-xl md:hidden'
            aria-label='Menü'
          >
            {open ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className='border-border bg-background/95 absolute top-full mt-2 w-[calc(100%-2rem)] max-w-5xl rounded-2xl border p-4 shadow-lg backdrop-blur-lg md:hidden'
            >
              <div className='flex flex-col gap-1'>
                {links.map(l => (
                  <button
                    key={l.href}
                    onClick={() => scrollTo(l.href)}
                    className='text-muted-foreground hover:bg-secondary hover:text-foreground rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors'
                  >
                    {l.label}
                  </button>
                ))}
                <div className='border-border mt-2 flex flex-col gap-2 border-t pt-3'>
                  <Button variant='outline' size='xl' className='w-full' asChild>
                    <Link href='/login'>Giriş Yap</Link>
                  </Button>
                  <Button color='primary-pink' size='xl' className='w-full' asChild>
                    <Link href='/onboarding'>fiyuu İşletmesi Ol</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {scrolled && (
        <Button
          color='primary-pink'
          title='Yukarı Çık'
          aria-label='Yukarı Çık'
          size='icon-sm'
          className='absolute right-4 bottom-4 z-20'
          onClick={() => scrollTo('#hero')}
        >
          <ArrowUp className='size-5' />
        </Button>
      )}
    </>
  )
}
