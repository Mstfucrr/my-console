'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { memo } from 'react'

const steps = [
  { id: 0, title: 'Alan Tipi', description: 'Poligon veya Mahalle' },
  { id: 1, title: 'Alan Tanımı', description: 'Koordinat veya mahalle seçimi' },
  { id: 2, title: 'Ayarlar', description: 'İsim ve durum' }
]

interface StepIndicatorProps {
  currentStep: number
}

export const StepIndicator = memo(function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className='mb-6'>
      <div className='flex items-center justify-center space-x-4'>
        {steps.map((step, index) => (
          <div key={step.id} className='flex items-center'>
            <div className='flex gap-2'>
              <div
                className={cn(
                  'bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium',
                  { 'bg-primary text-primary-foreground': currentStep === step.id },
                  { 'bg-success text-muted-foreground': currentStep > step.id }
                )}
              >
                {currentStep > step.id ? (
                  <Check className='text-success-foreground size-5 font-bold' />
                ) : (
                  <span>{step.id + 1}</span>
                )}
              </div>
              <div className='flex flex-col gap-1'>
                <p className='text-xs font-medium'>{step.title}</p>
                <p className='text-muted-foreground text-xs'>{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && <div className='bg-muted mx-4 h-1 w-8' />}
          </div>
        ))}
      </div>
    </div>
  )
})
