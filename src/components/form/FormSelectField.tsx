import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, type SelectProps } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

interface SelectOption {
  value: string | number
  label: string | number
}

interface FormSelectFieldProps<T extends FieldValues> extends Omit<SelectProps, 'value' | 'onValueChange'> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  placeholder?: string
  options: SelectOption[]
  formItemClassName?: string
  onValueChange?: (value: string) => void
  tabIndex?: number
}

export function FormSelectField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  options,
  formItemClassName,
  onValueChange,
  tabIndex,
  ...props
}: FormSelectFieldProps<T>) {
  const {
    field: { value, onChange },
    fieldState: { error }
  } = useController({ name, control })

  const handleValueChange = (value: string) => {
    onValueChange?.(value)
    onChange(value)
  }

  return (
    <FormItem className={formItemClassName}>
      {label && (
        <FormLabel htmlFor={name} className={cn('text-sm font-medium', error && 'text-red-500')}>
          {label}
        </FormLabel>
      )}
      <FormControl>
        <Select value={value} onValueChange={handleValueChange} {...props}>
          <SelectTrigger className={cn('w-full', error && 'border-red-500')} tabIndex={tabIndex}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.length > 0 ? (
              <div className='max-h-48 overflow-y-auto'>
                {options.map(option => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </div>
            ) : (
              <div className='text-muted-foreground flex items-center justify-center p-2 text-sm'>
                Bir sonuç bulunamadı.
              </div>
            )}
          </SelectContent>
        </Select>
      </FormControl>
      {error && <FormMessage className='-mt-2'>{error.message}</FormMessage>}
    </FormItem>
  )
}
