import { PHONE_REGEX } from '@/lib/regex'
import type { LucideIcon } from 'lucide-react'
import type { ClipboardEvent } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { FormMaskedInputField, FormMaskedInputFieldProps } from './FormMaskedInputField'

type FormPhoneFieldProps<T extends FieldValues> = {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  placeholder?: string
  required?: boolean
  formItemClassName?: string
  tabIndex?: number
  autoComplete?: string
  autoFocus?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | null
  Icon?: LucideIcon
  customMask?: string
}

function normalizePhonePaste(value: string) {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('0')) digits = digits.slice(1)
  else if (digits.startsWith('90')) digits = digits.slice(2)
  return digits.slice(0, 10)
}

export function handlePhonePaste(event: ClipboardEvent<HTMLInputElement>) {
  event.preventDefault()
  const normalized = normalizePhonePaste(event.clipboardData.getData('Text'))
  const input = event.target as HTMLInputElement
  input.value = normalized
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

export function FormPhoneField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = '(555) 123-4567',
  required,
  formItemClassName,
  tabIndex,
  autoComplete = 'off',
  autoFocus,
  size = 'md',
  Icon,
  customMask,
  ...imaskProps
}: FormPhoneFieldProps<T> & Omit<FormMaskedInputFieldProps<T>, 'mask' | 'lazy' | 'type'>) {
  return (
    <FormMaskedInputField
      {...imaskProps}
      mask={customMask ?? '(000) 000-0000'}
      lazy={false}
      type='number'
      name={name}
      required={required}
      control={control}
      label={label}
      formItemClassName={formItemClassName}
      placeholder={placeholder}
      tabIndex={tabIndex}
      regexPattern={imaskProps.regexPattern ?? PHONE_REGEX}
      onPaste={handlePhonePaste}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      size={size}
      Icon={Icon}
    />
  )
}
