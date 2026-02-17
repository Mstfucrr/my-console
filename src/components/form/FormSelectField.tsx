import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  type SelectProps
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

export interface SelectOption {
  value: string | number
  label: string | number
}

export interface GroupedSelectOption {
  groupLabel: string
  items: SelectOption[]
}

interface FormSelectFieldProps<T extends FieldValues> extends Omit<SelectProps, 'value' | 'onValueChange'> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  placeholder?: string
  options?: SelectOption[]
  groupedOptions?: GroupedSelectOption[]
  formItemClassName?: string
  inputClassName?: string
  onValueChange?: (value: string) => void
  tabIndex?: number
  required?: boolean
}

export function FormSelectField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  options,
  groupedOptions,
  formItemClassName,
  inputClassName,
  onValueChange,
  tabIndex,
  required,
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

  const hasOptions = groupedOptions ? groupedOptions.some(g => g.items.length > 0) : (options?.length ?? 0) > 0

  return (
    <FormItem className={formItemClassName}>
      {label && (
        <FormLabel htmlFor={name} className={cn('text-sm font-medium', error && 'text-red-500')}>
          {label}
          {required && <span className='ml-0.5'>*</span>}
        </FormLabel>
      )}
      <FormControl>
        <Select value={value} onValueChange={handleValueChange} {...props}>
          <SelectTrigger
            id={name}
            className={cn('w-full', error && 'border-red-500', inputClassName)}
            tabIndex={tabIndex}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {hasOptions ? (
              <div className='max-h-48 overflow-y-auto'>
                {groupedOptions
                  ? groupedOptions.map(group => (
                      <SelectGroup key={group.groupLabel}>
                        <SelectLabel>{group.groupLabel}</SelectLabel>
                        {group.items.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))
                  : options?.map(option => (
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
