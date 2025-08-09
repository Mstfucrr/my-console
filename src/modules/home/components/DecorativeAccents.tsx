import { motion } from 'framer-motion'

export default function DecorativeAccents() {
  return (
    <>
      {/* Polygon Accent Bottom Right */}
      <motion.div
        className='bg-primary-400/20 absolute right-0 bottom-0 size-48 origin-bottom-right'
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      />

      {/* Polygon Accent Top Right */}
      <motion.div
        className='bg-primary-400/20 absolute top-0 right-0 size-48 origin-top-right'
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
      />
    </>
  )
}
