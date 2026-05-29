import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

export type FormRadioOption<V extends string> = {
  value: V
  label: string
  /** Yoksa `name` + value ile üretilir */
  id?: string
}

type FormRadioGroupFieldProps<T extends FieldValues, V extends string> = {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  required?: boolean
  options: readonly FormRadioOption<V>[]
  formItemClassName?: string
  radioGroupClassName?: string
  /** `field.onChange` sonrası (ör. bağımlı alanları sıfırlama) */
  onAfterChange?: (value: V) => void
}

export function FormRadioGroupField<T extends FieldValues, V extends string = string>({
  name,
  control,
  label,
  required,
  options,
  formItemClassName,
  radioGroupClassName,
  onAfterChange
}: FormRadioGroupFieldProps<T, V>) {
  const {
    field,
    fieldState: { error }
  } = useController({ name, control })

  return (
    <FormItem className={formItemClassName}>
      {label && (
        <FormLabel className={cn('text-sm font-medium', error && 'text-red-500')}>
          {label}
          {required && <span className='ml-0.5'>*</span>}
        </FormLabel>
      )}
      <FormControl>
        <RadioGroup
          className={cn('flex flex-wrap gap-6', radioGroupClassName)}
          value={field.value}
          onValueChange={v => {
            field.onChange(v)
            onAfterChange?.(v as V)
          }}
        >
          {options.map(opt => {
            const inputId = opt.id ?? `${String(name)}-${opt.value}`
            return (
              <label key={opt.value} htmlFor={inputId} className='flex cursor-pointer items-center gap-2 text-sm'>
                <RadioGroupItem value={opt.value} id={inputId} />
                {opt.label}
              </label>
            )
          })}
        </RadioGroup>
      </FormControl>
      {error && <FormMessage className='-mt-2'>{error.message}</FormMessage>}
    </FormItem>
  )
}
