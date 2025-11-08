import { PasswordInput } from '@/components/form/password-input'
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input, InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

interface FormInputFieldProps<T extends FieldValues> extends InputProps {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  type?: string
  placeholder?: string
  formItemClassName?: string
  required?: boolean
}

export function FormInputField<T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  placeholder,
  formItemClassName,
  required,
  ...props
}: FormInputFieldProps<T>) {
  const {
    field,
    fieldState: { error }
  } = useController({ name, control })

  return (
    <FormItem className={formItemClassName}>
      {label && (
        <FormLabel htmlFor={name} className={cn('text-sm font-medium', error && 'text-red-500')}>
          {label}
          {required && <span className='ml-0.5'>*</span>}
        </FormLabel>
      )}
      <FormControl>
        {type === 'password' ? (
          <PasswordInput
            {...field}
            {...props}
            placeholder={placeholder}
            className={cn('w-full', error && 'border-red-500')}
          />
        ) : (
          <Input
            {...field}
            {...props}
            type={type}
            placeholder={placeholder}
            className={cn('w-full', error && 'border-red-500')}
          />
        )}
      </FormControl>
      {error && <FormMessage className='-mt-2'>{error.message}</FormMessage>}
    </FormItem>
  )
}
