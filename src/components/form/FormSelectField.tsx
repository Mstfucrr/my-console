import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, type SelectProps } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

interface SelectOption {
  value: string
  label: string
}

interface FormSelectFieldProps<T extends FieldValues> extends Omit<SelectProps, 'value' | 'onValueChange'> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  placeholder?: string
  options: SelectOption[]
  formItemClassName?: string
}

export default function FormSelectField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  options,
  formItemClassName,
  ...props
}: FormSelectFieldProps<T>) {
  const {
    field: { value, onChange },
    fieldState: { error }
  } = useController({ name, control })

  return (
    <FormItem className={formItemClassName}>
      {label && (
        <FormLabel htmlFor={name} className={cn('text-sm font-medium', error && 'text-red-500')}>
          {label}
        </FormLabel>
      )}
      <FormControl>
        <Select value={value} onValueChange={onChange} {...props}>
          <SelectTrigger className={cn('w-full', error && 'border-red-500')}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      {error && <FormMessage className='-mt-2'>{error.message}</FormMessage>}
    </FormItem>
  )
}
