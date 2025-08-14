import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea, TextareaProps } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

interface FormTextareaFieldProps<T extends FieldValues> extends Omit<TextareaProps, 'value' | 'onChange'> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  placeholder?: string
  formItemClassName?: string
}

export default function FormTextareaField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  formItemClassName,
  ...props
}: FormTextareaFieldProps<T>) {
  const {
    field,
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
        <Textarea {...field} {...props} placeholder={placeholder} className={cn('w-full', error && 'border-red-500')} />
      </FormControl>
      {error && <FormMessage className='-mt-2'>{error.message}</FormMessage>}
    </FormItem>
  )
}
