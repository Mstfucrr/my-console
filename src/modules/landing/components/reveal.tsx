'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function Reveal({
  children,
  delay = 0,
  className,
  direction = 'up'
}: {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'left' | 'right' | 'none'
}) {
  const initial =
    direction === 'up'
      ? { opacity: 0, y: 32 }
      : direction === 'left'
        ? { opacity: 0, x: -36 }
        : direction === 'right'
          ? { opacity: 0, x: 36 }
          : { opacity: 0 }

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
