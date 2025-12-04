'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedFiltersProps {
  isOpen: boolean
  children: ReactNode
}

export function AnimatedFilters({ isOpen, children }: AnimatedFiltersProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className='overflow-hidden'
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
