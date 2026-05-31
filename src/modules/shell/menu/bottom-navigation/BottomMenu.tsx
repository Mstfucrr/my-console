import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ProfileButton } from '../common/profile-button'
import { SupportDialog } from '../common/support-dialog'
import { isLocationMatch } from '../utils'

const springConfig = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 0.5
}

export type BottomMenuItem = {
  key: string
  title: string
  href: Route
  Icon?: LucideIcon
}

export type BottomMenuSection = {
  key: string
  title: string
  Icon?: LucideIcon
  items: BottomMenuItem[]
}

type BottomMenuProps = {
  onClick: () => void
  quickItems: BottomMenuItem[]
  sections: BottomMenuSection[]
}
export function BottomMenu({ onClick, quickItems, sections }: BottomMenuProps) {
  const pathname = usePathname()
  const [openSupportDialog, setOpenSupportDialog] = useState(false)
  const [expandedSectionKeys, setExpandedSectionKeys] = useState<Set<string>>(new Set())

  const toggleSection = (key: string) => {
    setExpandedSectionKeys(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <motion.div
      variants={{
        hidden: { scale: 0.92, originX: 1, originY: 1, opacity: 0, y: 12, filter: 'blur(2px)' },
        visible: { scale: 1, originX: 1, originY: 1, opacity: 1, y: 0, filter: 'blur(0px)' }
      }}
      initial='hidden'
      animate='visible'
      exit={{ scale: 0.92, opacity: 0, y: 8, filter: 'blur(2px)' }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1], ...springConfig }}
      className={cn(
        'bg-background/95 border-border absolute right-0 bottom-[110%] -z-10 min-w-48 origin-bottom-right rounded-2xl border p-2 shadow-lg backdrop-blur-xl',
        openSupportDialog && 'bottom-7 h-0 overflow-hidden'
      )}
    >
      {quickItems.length > 0 && (
        <div className='mb-2 flex flex-col gap-1'>
          {quickItems.map((item, index) => {
            const Icon = item.Icon
            const isActive = isLocationMatch(item.href, pathname)

            return (
              <motion.div
                key={item.key}
                variants={{
                  hidden: { opacity: 0, y: 10, x: 12, scale: 0.98 },
                  visible: { opacity: 1, y: 0, x: 0, scale: 1 }
                }}
                initial='hidden'
                animate='visible'
                exit={{ opacity: 0, y: 8, x: 8, scale: 0.98 }}
                transition={{ duration: 0.24, delay: 0.04 + index * 0.03, ease: [0.22, 1, 0.36, 1] }}
              >
                <Button
                  asChild
                  variant='ghost'
                  size='xs'
                  className={cn(
                    'hover:bg-primary hover:text-primary-foreground w-full justify-start gap-2 rounded-lg text-xs',
                    isActive && 'bg-primary text-primary-foreground'
                  )}
                >
                  <Link href={item.href} onClick={onClick}>
                    {Icon && <Icon className='size-4' />}
                    <span className='truncate'>{item.title}</span>
                  </Link>
                </Button>
              </motion.div>
            )
          })}
        </div>
      )}

      {sections.length > 0 && (
        <div className='mb-2 space-y-2'>
          {sections.map((section, sectionIndex) => {
            const SectionIcon = section.Icon
            const isExpanded = expandedSectionKeys.has(section.key)
            return (
              <motion.div
                key={section.key}
                variants={{
                  hidden: { opacity: 0, y: 10, x: 12, scale: 0.98 },
                  visible: { opacity: 1, y: 0, x: 0, scale: 1 }
                }}
                initial='hidden'
                animate='visible'
                exit={{ opacity: 0, y: 8, x: 8, scale: 0.98 }}
                transition={{ duration: 0.24, delay: 0.08 + sectionIndex * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className='bg-muted/60 rounded-xl px-1.5'
              >
                <Button
                  size='xs'
                  variant='ghost'
                  className='mb-1 flex w-full items-center justify-between px-1 text-[11px] font-semibold'
                  onClick={() => toggleSection(section.key)}
                >
                  <span className='flex items-center gap-1'>
                    {SectionIcon && <SectionIcon className='size-3.5' />}
                    <span>{section.title}</span>
                  </span>
                  <ChevronDown className={cn('size-3.5 transition-transform', isExpanded && 'rotate-180')} />
                </Button>
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key={`${section.key}-expanded`}
                      initial={{ height: 0, opacity: 0, y: -4 }}
                      animate={{ height: 'auto', opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -4 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className='overflow-hidden'
                    >
                      <div className='mt-1 flex flex-col gap-1'>
                        {section.items.map((item, itemIndex) => {
                          const isActive = isLocationMatch(item.href, pathname)
                          return (
                            <motion.div
                              key={item.key}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -6 }}
                              transition={{ duration: 0.18, delay: itemIndex * 0.025, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <Button
                                asChild
                                variant='ghost'
                                size='xs'
                                className={cn('w-full', isActive && 'bg-primary text-primary-foreground')}
                              >
                                <Link href={item.href} onClick={onClick}>
                                  <span className='truncate'>{item.title}</span>
                                </Link>
                              </Button>
                            </motion.div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}

      <div className='flex items-center justify-center gap-2'>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 }
          }}
          initial='hidden'
          animate='visible'
          exit='hidden'
          transition={{ duration: 0.35, delay: 0.2, ease: [0.4, 0, 0.2, 1], ...springConfig }}
          className='mt-2 flex justify-end'
        >
          <ProfileButton className='size-10 rounded-full p-0' onClick={onClick} />
        </motion.div>
        <motion.div
          key='support'
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 }
          }}
          initial='hidden'
          animate='visible'
          exit='hidden'
          transition={{ duration: 0.35, delay: 0.4, ease: [0.4, 0, 0.2, 1], ...springConfig }}
          className='mt-1 flex justify-end'
        >
          <SupportDialog className='size-10 rounded-full p-2' onOpenStateChange={setOpenSupportDialog} />
        </motion.div>
      </div>
    </motion.div>
  )
}
