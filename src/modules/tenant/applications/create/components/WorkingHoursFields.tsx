'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, ChevronDown, Copy, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { type FieldErrors, useFieldArray, useFormState, useWatch } from 'react-hook-form'
import { DAY_LABELS_TR, DEFAULT_WORKING_HOURS, type WorkingHoursFormData } from '../constants'
import { useStoreApplicationWizard } from '../context/StoreApplicationWizardContext'
import { WorkingHoursIntervalCard } from './WorkingHoursIntervalCard'

function formatWorkingHourPreview(value: string | null): string {
  if (value == null || value === '') return '—'
  const digits = String(value).replace(/\D/g, '')
  if (digits.length === 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`
  return String(value)
}

const TAB_BASE = 10
const TAB_PER_DAY = 40

type WorkingHoursDayRowProps = {
  dayIndex: number
  isExpanded: boolean
  onToggleExpand: (day: string) => void
}

function collectIntervalFieldMessages(startMsg?: string, endMsg?: string): string[] {
  const raw = [startMsg, endMsg].filter((m): m is string => Boolean(m?.trim()))
  return [...new Set(raw)]
}

function getWorkingHoursErrorDays(errors: FieldErrors<WorkingHoursFormData>): string[] {
  const workingHoursErrors = errors.workingHours
  if (!Array.isArray(workingHoursErrors)) return []
  return workingHoursErrors.flatMap((dayError, index) => (dayError ? [DEFAULT_WORKING_HOURS[index].day] : []))
}

function WorkingHoursDayRow({ dayIndex, isExpanded, onToggleExpand }: WorkingHoursDayRowProps) {
  const { workingHoursForm: form } = useStoreApplicationWizard()
  const { errors, isSubmitted } = useFormState({ control: form.control })
  const day = useWatch({ control: form.control, name: `workingHours.${dayIndex}.day` })
  const enabled = useWatch({ control: form.control, name: `workingHours.${dayIndex}.enabled` })
  const intervals = useWatch({ control: form.control, name: `workingHours.${dayIndex}.intervals` }) ?? []

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `workingHours.${dayIndex}.intervals`
  })

  const dayLabel = DAY_LABELS_TR[day] ?? day

  const toggleEnabled = (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = !enabled
    form.setValue(`workingHours.${dayIndex}.enabled`, next, { shouldDirty: true, shouldValidate: true })
  }

  const addInterval = () => {
    append({ start: null, end: null })
  }

  const applyToAll = () => {
    const rows = form.getValues('workingHours')
    const source = rows[dayIndex]
    if (!source || !source.enabled) return
    form.reset({
      workingHours: rows.map(row => ({
        ...row,
        enabled: source.enabled,
        intervals: source.intervals.map(({ start, end }) => ({ start, end }))
      }))
    })
  }

  return (
    <div>
      <button
        type='button'
        onClick={() => onToggleExpand(day)}
        className={`flex w-full items-center justify-between px-6 py-4 transition-colors ${
          isExpanded ? 'bg-primary/5' : 'hover:bg-secondary/50'
        }`}
      >
        <div className='flex items-center gap-4'>
          <div
            role='switch'
            aria-checked={enabled}
            onClick={toggleEnabled}
            className={`h-7 w-12 cursor-pointer rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-muted'}`}
          >
            <motion.div
              className='mx-0.5 mt-0.5 h-6 w-6 rounded-full bg-white shadow-md'
              animate={{ x: enabled ? 20 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </div>
          <div className='text-left'>
            <div className='text-foreground font-semibold'>{dayLabel}</div>
            {enabled ? (
              <div className='text-muted-foreground text-sm'>{intervals?.length ?? 0} saat aralığı</div>
            ) : (
              <div className='text-muted-foreground text-sm'>Kapalı</div>
            )}
          </div>
        </div>
        <div className='flex items-center gap-3'>
          {enabled && intervals && (
            <div className='hidden items-center gap-1 sm:flex'>
              {intervals.map((interval, i) => (
                <span
                  key={`${day}-chip-${i}`}
                  className='bg-primary/10 text-primary rounded-md px-2 py-1 text-xs font-medium'
                >
                  {formatWorkingHourPreview(interval.start)}–{formatWorkingHourPreview(interval.end)}
                </span>
              ))}
            </div>
          )}
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className='text-muted-foreground h-5 w-5' />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className='overflow-hidden'
          >
            <div className='bg-secondary/20 space-y-4 px-2 pt-2 pb-6 md:px-6'>
              <div className='flex flex-col gap-2 md:grid md:grid-cols-2 xl:grid-cols-3'>
                {fields.map((field, intervalIndex) => {
                  const intervalErrors = errors.workingHours?.[dayIndex]?.intervals?.[intervalIndex]
                  return (
                    <WorkingHoursIntervalCard
                      key={field.id}
                      form={form}
                      fieldId={field.id}
                      dayIndex={dayIndex}
                      intervalIndex={intervalIndex}
                      inputTabIndex={TAB_BASE + dayIndex * TAB_PER_DAY + intervalIndex * 2}
                      errorMessages={collectIntervalFieldMessages(
                        intervalErrors?.start?.message,
                        intervalErrors?.end?.message
                      )}
                      onRemove={() => remove(intervalIndex)}
                      isSubmitted={isSubmitted}
                      intervalCount={fields.length}
                    />
                  )
                })}
              </div>

              <div className='flex flex-wrap items-center gap-3 pt-2'>
                <Button
                  type='button'
                  variant='soft'
                  data-testid={`${day}-add-interval`}
                  className='gap-2'
                  onClick={addInterval}
                >
                  <Plus className='h-4 w-4' />
                  Aralık ekle
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  data-testid={`${day}-apply-to-all`}
                  className='gap-2'
                  onClick={applyToAll}
                >
                  <Copy className='h-4 w-4' />
                  Tümüne uygula
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function WorkingHoursFields() {
  const { workingHoursForm: form } = useStoreApplicationWizard()
  const { errors, isSubmitted } = useFormState({ control: form.control })

  const [expandedDays, setExpandedDays] = useState<string[]>(['monday'])

  const handleToggleExpand = (day: string) => {
    setExpandedDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]))
  }

  useEffect(() => {
    if (!isSubmitted) return
    const errorDays = getWorkingHoursErrorDays(errors)
    if (errorDays.length === 0) return
    const id = requestAnimationFrame(() => setExpandedDays(prev => [...new Set([...prev, ...errorDays])]))
    return () => cancelAnimationFrame(id)
  }, [isSubmitted, errors])

  return (
    <Card data-testid='store-application-working-hours'>
      <CardHeader>
        <div className='space-y-1.5'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Calendar className='size-4.5' />
            Çalışma Saatleri
          </CardTitle>
          <CardDescription>Güne tıklayarak detayları görün</CardDescription>
        </div>
      </CardHeader>

      <CardContent className='p-0!'>
        <div className='divide-border divide-y'>
          {DEFAULT_WORKING_HOURS.map((row, dayIndex) => {
            const isExpanded = expandedDays.includes(row.day)
            return (
              <WorkingHoursDayRow
                key={row.day}
                dayIndex={dayIndex}
                isExpanded={isExpanded}
                onToggleExpand={handleToggleExpand}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
