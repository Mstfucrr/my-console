'use client'

import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input, InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

type Props<T extends FieldValues> = Omit<InputProps, 'name' | 'defaultValue' | 'value' | 'onChange'> & {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  required?: boolean
  formItemClassName?: string
  regexPattern?: RegExp
}

function toTRCurrency(raw: string) {
  let v = (raw ?? '').replace(/\./g, '').replace(/[^\d,]/g, '')

  const i = v.indexOf(',')
  if (i !== -1) v = v.slice(0, i + 1) + v.slice(i + 1).replace(/,/g, '')

  const [intRaw, decRaw = ''] = v.split(',')
  const int = (intRaw || '').replace(/^0+(?=\d)/, '') || '0'
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return v.endsWith(',') || decRaw.length ? `${grouped},${decRaw.slice(0, 2)}` : grouped
}

function insertAtCursor(input: HTMLInputElement, text: string) {
  const start = input.selectionStart ?? input.value.length
  const end = input.selectionEnd ?? input.value.length
  return { start, next: input.value.slice(0, start) + text + input.value.slice(end) }
}

export function FormCurrencyInputField<T extends FieldValues>({
  name,
  control,
  label,
  required,
  formItemClassName,
  regexPattern,
  className,
  placeholder = '0,00',
  type = 'text',
  inputMode = 'decimal',
  pattern = '[0-9,]*',
  onKeyDown,
  onPaste,
  ...rest
}: Props<T>) {
  const {
    field,
    fieldState: { error }
  } = useController({ name, control })

  const value = typeof field.value === 'string' ? field.value : (field.value?.toString?.() ?? '')

  const commit = (next: string) => {
    const formatted = toTRCurrency(next)
    if (!regexPattern || regexPattern.test(formatted)) field.onChange(formatted)
  }

  return (
    <FormItem className={formItemClassName}>
      {label && (
        <FormLabel htmlFor={name} className={cn('text-sm font-medium', error && 'text-red-500')}>
          {label}
          {required && <span className='ml-0.5'>*</span>}
        </FormLabel>
      )}

      <FormControl>
        <Input
          {...rest}
          {...field}
          id={name}
          value={value}
          type={type}
          inputMode={inputMode}
          pattern={pattern}
          placeholder={placeholder}
          className={cn('w-full', error && 'border-red-500', className)}
          onChange={e => commit(e.target.value)}
          onPaste={e => {
            e.preventDefault()
            commit(e.clipboardData.getData('Text'))
            onPaste?.(e)
          }}
          onKeyDown={e => {
            if (e.key === '.') {
              e.preventDefault()
              const input = e.currentTarget
              const { start, next } = insertAtCursor(input, ',')
              commit(next)
              // commit sonrası caret'i 1 ileri taşı
              requestAnimationFrame(() => input.setSelectionRange(start + 1, start + 1))
            }
            onKeyDown?.(e)
          }}
        />
      </FormControl>

      {error && <FormMessage className='-mt-2'>{error.message}</FormMessage>}
    </FormItem>
  )
}
