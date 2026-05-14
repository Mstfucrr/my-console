'use client'

import { FormMaskedInputField } from '@/components/form/FormMaskedInputField'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AnimatePresence, motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { type FieldPath, type UseFormReturn } from 'react-hook-form'
import { type WorkingHoursFormData } from '../constants'
import { isValidPartialWorkingHourDigits } from '../utils/working-hour-time'

type WorkingHoursIntervalCardProps = {
  form: UseFormReturn<WorkingHoursFormData>
  fieldId: string
  dayIndex: number
  intervalIndex: number
  inputTabIndex: number
  errorMessages: string[]
  onRemove: () => void
  isSubmitted: boolean
  intervalCount: number
}

export function WorkingHoursIntervalCard({
  form,
  fieldId,
  dayIndex,
  intervalIndex,
  inputTabIndex,
  errorMessages,
  onRemove,
  isSubmitted,
  intervalCount
}: WorkingHoursIntervalCardProps) {
  const startPath = `workingHours.${dayIndex}.intervals.${intervalIndex}.start` as FieldPath<WorkingHoursFormData>
  const endPath = `workingHours.${dayIndex}.intervals.${intervalIndex}.end` as FieldPath<WorkingHoursFormData>

  const revalidatePair = () => {
    if (!isSubmitted) return
    const paths: FieldPath<WorkingHoursFormData>[] = [startPath, endPath]
    const next = intervalIndex + 1
    if (next < intervalCount) {
      paths.push(
        `workingHours.${dayIndex}.intervals.${next}.start` as FieldPath<WorkingHoursFormData>,
        `workingHours.${dayIndex}.intervals.${next}.end` as FieldPath<WorkingHoursFormData>
      )
    }
    void form.trigger(paths)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      layout='position'
      transition={{ delay: intervalIndex * 0.1, duration: 0.3 }}
      className='min-w-0'
    >
      <Card className='relative flex w-full min-w-0 items-start gap-3 p-4'>
        <div className='bg-primary/10 text-primary mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold'>
          {intervalIndex + 1}
        </div>
        <div className='flex min-w-0 flex-1 flex-col gap-2'>
          <div className='flex min-w-0 flex-row flex-wrap gap-2 sm:items-end'>
            <FormMaskedInputField
              name={startPath}
              control={form.control}
              mask='00:00'
              lazy={false}
              placeholder='00:00'
              type='time'
              tabIndex={inputTabIndex}
              autoFocus={intervalIndex === 0}
              formItemClassName='space-y-1'
              className='h-9 w-max font-mono'
              preValidateDigits={isValidPartialWorkingHourDigits}
              label='Açılış'
              hideErrorMessage
              onMaskedAccept={revalidatePair}
            />
            <span className='text-muted-foreground hidden shrink-0 self-center sm:block'>–</span>
            <FormMaskedInputField
              name={endPath}
              control={form.control}
              mask='00:00'
              lazy={false}
              placeholder='00:00'
              type='time'
              tabIndex={inputTabIndex + 1}
              formItemClassName='space-y-1'
              className='h-9 w-max font-mono'
              preValidateDigits={isValidPartialWorkingHourDigits}
              label='Kapanış'
              hideErrorMessage
              onMaskedAccept={revalidatePair}
            />
          </div>
          <AnimatePresence initial={false}>
            {errorMessages.length > 0 && (
              <motion.ul
                key={fieldId}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{
                  duration: 0.2,
                  layout: { duration: 0.22, ease: [0.4, 0, 0.2, 1] }
                }}
                className='text-destructive list-inside list-disc space-y-0.5 overflow-hidden text-xs'
              >
                {errorMessages.map(msg => (
                  <li key={msg}>{msg}</li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
        {intervalCount > 1 && (
          <div className='max-xs:top-2 max-xs:right-2 xs:self-center max-xs:absolute shrink-0 self-end'>
            <Button type='button' color='destructive' variant='ghost' size='icon-xs' onClick={onRemove}>
              <Trash2 className='size-4' />
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
