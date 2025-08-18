import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ONBOARDING_STEPS } from '../data'

interface OnboardingHeaderProps {
  currentStep: number
}

const spring = { type: 'spring', stiffness: 260, damping: 24 }
const fadeUp = {
  initial: { opacity: 0, width: 0, scaleX: 0 },
  animate: { opacity: 1, width: 'auto', scaleX: 1 },
  exit: { opacity: 0, width: 0, scaleX: 0 }
}

export default function OnboardingHeader({ currentStep }: OnboardingHeaderProps) {
  return (
    <Card className='p-4 sm:p-6'>
      <div className='max-sm:space-y-4'>
        {/* Steps */}
        <motion.div
          className='flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6'
          layout
          transition={spring}
        >
          {ONBOARDING_STEPS.slice(0, -1).map((step, index) => {
            const Icon = step.icon
            const isCurrent = index === currentStep
            const isCompleted = index < currentStep

            return (
              <motion.div key={step.id} className='flex items-center gap-2'>
                {/* Icon bubble */}
                <div
                  className={cn('flex items-center justify-center rounded-full transition-colors', {
                    'size-8 sm:size-10': true,
                    'bg-primary text-primary-foreground': isCurrent,
                    'bg-success text-success-foreground': isCompleted,
                    'bg-muted text-muted-foreground': !isCurrent && !isCompleted
                  })}
                >
                  <Icon className='size-4 sm:size-5' />
                </div>

                {/* Title & description for current step */}
                <AnimatePresence initial={false} mode='wait'>
                  {isCurrent && (
                    <motion.div
                      key={`label-${step.id}`}
                      className='flex origin-center flex-col'
                      variants={fadeUp}
                      initial='initial'
                      animate='animate'
                      exit='exit'
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      <span className='text-primary text-xs font-medium text-nowrap sm:text-sm'>{step.title}</span>
                      <span className='text-muted-foreground hidden text-xs text-nowrap sm:block'>
                        {step.description}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Divider with subtle reveal - hidden on mobile */}
                {index < ONBOARDING_STEPS.length - 2 && (
                  <motion.div
                    className='bg-muted-foreground/50 hidden h-px origin-left sm:block'
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{ width: 32 }}
                  />
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* Mobile: Current step description */}
        <div className='sm:hidden'>
          <AnimatePresence mode='wait'>
            {ONBOARDING_STEPS.slice(0, -1).map((step, index) => {
              if (index === currentStep) {
                return (
                  <motion.div
                    key={`mobile-desc-${step.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className='text-center'
                  >
                    <p className='text-muted-foreground text-sm'>{step.description}</p>
                  </motion.div>
                )
              }
              return null
            })}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  )
}
