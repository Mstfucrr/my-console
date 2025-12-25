'use client'

import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input, InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

type FormCurrencyInputFieldProps<T extends FieldValues> = Omit<InputProps, 'name' | 'defaultValue'> & {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  placeholder?: string
  formItemClassName?: string
  required?: boolean
  /** FormInputField'teki gibi: input'a yazılacak değeri regex ile sınırla */
  regexPattern?: RegExp
}

function formatTRYInput(value: string) {
  // Nokta yazılmasın (binlik ayırıcıyı biz koyacağız)
  let v = (value ?? '').replace(/\./g, '')

  // Sadece rakam ve virgül kalsın
  v = v.replace(/[^\d,]/g, '')

  // Tek virgül kalsın
  const firstCommaIndex = v.indexOf(',')
  if (firstCommaIndex !== -1) {
    const before = v.slice(0, firstCommaIndex)
    const after = v.slice(firstCommaIndex + 1).replace(/,/g, '') // diğer virgülleri at
    v = `${before},${after}`
  }

  const [intPartRaw, decRaw = ''] = v.split(',')
  const intPart = (intPartRaw || '').replace(/^0+(?=\d)/, '') // 00012 -> 12 (tek 0 kalsın)
  const decPart = decRaw.slice(0, 2) // max 2 hane

  // Binlik ayırıcı
  const grouped = (intPart || '0').replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return decRaw.length > 0 || v.endsWith(',')
    ? `${grouped},${decPart}` // kullanıcı virgül yazdıysa virgülü koru
    : grouped
}

export function FormCurrencyInputField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = '0,00',
  formItemClassName,
  required,
  regexPattern,
  className,
  ...props
}: FormCurrencyInputFieldProps<T>) {
  const {
    field,
    fieldState: { error }
  } = useController({ name, control })

  const value = typeof field.value === 'string' ? field.value : (field.value?.toString?.() ?? '')

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
          {...props}
          {...field}
          id={name}
          type={props.type ?? 'text'}
          inputMode={props.inputMode ?? 'decimal'}
          // iOS/Android numerik klavye için (virgül çoğu TR klavyede çıkar)
          pattern={props.pattern ?? '[0-9,]*'}
          placeholder={placeholder}
          value={value}
          className={cn('w-full', error && 'border-red-500', className)}
          onKeyDown={e => {
            // Kullanıcı nokta yazdığında virgüle çevir
            if (e.key === '.') {
              e.preventDefault()
              const input = e.target as HTMLInputElement
              const cursorPos = input.selectionStart ?? input.value.length
              const newValue = input.value.slice(0, cursorPos) + ',' + input.value.slice(cursorPos)
              const next = formatTRYInput(newValue)
              if (!regexPattern || regexPattern.test(next)) {
                field.onChange(next)
                input.setSelectionRange(cursorPos + 1, cursorPos + 1)
              }
            }
          }}
          onPaste={e => {
            e.preventDefault()
            const pasted = e.clipboardData.getData('Text')
            const next = formatTRYInput(pasted)
            if (!regexPattern || regexPattern.test(next)) field.onChange(next)
            props.onPaste?.(e)
          }}
          onChange={e => {
            const next = formatTRYInput(e.target.value)
            if (!regexPattern || regexPattern.test(next)) {
              field.onChange(next)
            }
          }}
        />
      </FormControl>

      {error && <FormMessage className='-mt-2'>{error.message}</FormMessage>}
    </FormItem>
  )
}
