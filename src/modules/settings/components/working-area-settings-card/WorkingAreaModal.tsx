'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { AreaDefinitionStep } from './AreaDefinitionStep'
import { AreaTypeStep } from './AreaTypeStep'
import { SettingsStep } from './SettingsStep'
import { StepIndicator } from './StepIndicator'

import type { WorkingArea, WorkingAreaFormData } from './types'

const workingAreaSchema = z.object({
  name: z.string().min(1, 'Alan adı gereklidir'),
  isActive: z.boolean().default(true)
}) satisfies z.ZodType<WorkingAreaFormData>

interface WorkingAreaModalProps {
  open: boolean
  onClose: () => void
  onAdd: (area: WorkingArea) => void
}

export function WorkingAreaModal({ open, onClose, onAdd }: WorkingAreaModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedWorkingArea, setSelectedWorkingArea] = useState<WorkingArea | null>(null)
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([])

  const form = useForm<WorkingAreaFormData>({
    resolver: zodResolver(workingAreaSchema),
    defaultValues: { name: '', isActive: true }
  })

  const resetAll = () => {
    setCurrentStep(0)
    setSelectedWorkingArea(null)
    setSelectedNeighborhoods([])
    form.reset()
  }

  const handleClose = () => {
    resetAll()
    onClose()
  }

  const toggleNeighborhood = (n: string) => {
    setSelectedNeighborhoods(prev => (prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]))
  }

  const goNext = () => {
    if (currentStep === 1 && selectedWorkingArea?.type === 'neighborhood') {
      setSelectedWorkingArea(prev => (prev ? { ...prev, neighborhoods: selectedNeighborhoods } : prev))
    }
    setCurrentStep(s => Math.min(s + 1, 2))
  }

  const goBack = () => setCurrentStep(s => Math.max(s - 1, 0))

  const handleSubmitSettings = (values: WorkingAreaFormData) => {
    if (!selectedWorkingArea) return
    const newArea: WorkingArea = {
      ...selectedWorkingArea,
      id: Date.now().toString(),
      name: values.name,
      isActive: values.isActive
    }
    onAdd(newArea)
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent size='2xl'>
        <DialogHeader className='mb-2'>
          <DialogTitle>Çalışma Alanı Yönetimi</DialogTitle>
        </DialogHeader>

        <StepIndicator currentStep={currentStep} />

        {currentStep === 0 && (
          <AreaTypeStep selected={selectedWorkingArea} setSelected={wa => setSelectedWorkingArea(wa)} goNext={goNext} />
        )}

        {currentStep === 1 && selectedWorkingArea && (
          <AreaDefinitionStep
            selected={selectedWorkingArea}
            selectedNeighborhoods={selectedNeighborhoods}
            toggleNeighborhood={toggleNeighborhood}
            goBack={goBack}
            goNext={goNext}
          />
        )}

        {currentStep === 2 && selectedWorkingArea && (
          <SettingsStep
            form={form}
            selected={selectedWorkingArea}
            selectedNeighborhoods={selectedNeighborhoods}
            goBack={goBack}
            onSubmit={handleSubmitSettings}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
