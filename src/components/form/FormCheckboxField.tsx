import { Checkbox, type CheckboxProps } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface FormCheckboxFieldProps<T extends FieldValues> extends Omit<CheckboxProps, 'checked' | 'onCheckedChange'> {
  name: FieldPath<T>
  control: Control<T>
  label?: React.ReactNode
  formItemClassName?: string
  includeLabel?: boolean
}

export function FormCheckboxField<T extends FieldValues>({
  name,
  control,
  label,
  formItemClassName,
  className,
  includeLabel = true,
  ...props
}: FormCheckboxFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={formItemClassName}>
          <div className='flex items-center'>
            <FormControl>
              <Checkbox
                id={name}
                checked={field.value}
                onCheckedChange={checked => field.onChange(checked === true)}
                className={cn(fieldState.error && 'border-destructive', className)}
                {...props}
              />
            </FormControl>
            {label != null && (
              <FormLabel
                htmlFor={name}
                className={cn(
                  'pl-2.5 font-normal',
                  fieldState.error && 'text-destructive',
                  includeLabel && 'cursor-pointer'
                )}
                onClick={e => {
                  if (includeLabel) {
                    e.preventDefault()
                    field.onChange(!field.value)
                  }
                }}
              >
                {label}
              </FormLabel>
            )}
          </div>
          <FormMessage className='-mt-2' />
        </FormItem>
      )}
    />
  )
}
