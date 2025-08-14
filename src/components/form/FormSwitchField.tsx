import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Switch, type SwitchProps } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

interface FormSwitchFieldProps<T extends FieldValues> extends Omit<SwitchProps, 'checked' | 'onCheckedChange'> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  formItemClassName?: string
}

export default function FormSwitchField<T extends FieldValues>({
  name,
  control,
  label,
  formItemClassName,
  ...props
}: FormSwitchFieldProps<T>) {
  const {
    field: { value, onChange },
    fieldState: { error }
  } = useController({ name, control })

  return (
    <FormItem className={formItemClassName}>
      <div className='flex items-center space-x-2'>
        <FormControl>
          <Switch checked={value} onCheckedChange={onChange} {...props} className={cn(error && 'border-red-500')} />
        </FormControl>
        {label && (
          <FormLabel htmlFor={name} className={cn('cursor-pointer text-sm font-medium', error && 'text-red-500')}>
            {label}
          </FormLabel>
        )}
      </div>
      {error && <FormMessage className='-mt-2'>{error.message}</FormMessage>}
    </FormItem>
  )
}
