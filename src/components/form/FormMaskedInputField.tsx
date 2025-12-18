import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { type InputProps, inputVariants } from '@/components/ui/input'
import { type InputColor, type InputVariant, type Radius, type Shadow } from '@/lib/type'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import * as React from 'react'
import { type Control, type FieldPath, type FieldValues, useController } from 'react-hook-form'
import { IMaskInput } from 'react-imask'

// IMaskInput'ın props tipini al
type IMaskInputElementProps = React.ComponentPropsWithoutRef<typeof IMaskInput>

// IMask'ın kendi alanlarından override edeceklerimizi dışarı atıyoruz
type MaskBaseProps = Omit<
  IMaskInputElementProps,
  | 'value'
  | 'onAccept'
  | 'onBlur'
  | 'inputRef'
  | 'ref'
  | 'className'
  | 'type'
  | 'size'
  | 'name'
  | 'inputMode'
  | 'definitions'
  | 'regexPattern'
>

interface FormMaskedInputFieldProps<T extends FieldValues> extends MaskBaseProps {
  // RHF alanları
  name: FieldPath<T>
  control: Control<T>

  // UI / form alanları
  label?: string
  formItemClassName?: string
  required?: boolean
  hideSpinButtons?: boolean

  size?: InputProps['size']
  color?: InputColor
  variant?: InputVariant
  radius?: Radius
  shadow?: Shadow
  Icon?: LucideIcon
  className?: string

  // numeric klavye için helper
  type?: 'text' | 'number'

  /**
   * IMask options
   */
  mask: string | RegExp
  lazy?: boolean
  placeholderChar?: string
  regexPattern?: RegExp
}

/**
 * react-imask + shadcn Input + RHF
 *
 * Örnek:
 * <FormMaskedInputField
 *   name="customerPhone"
 *   control={form.control}
 *   label="Telefon"
 *   required
 *   mask="(000) 000-0000"
 *   lazy={false}
 *   placeholder="(555) 123-4567"
 *   inputMode="numeric"
 * />
 */
export function FormMaskedInputField<T extends FieldValues>({
  name,
  control,
  label,
  formItemClassName,
  required,
  hideSpinButtons = true,
  size = 'md',
  color,
  variant = 'bordered',
  radius = 'md',
  shadow,
  Icon,
  className,
  type = 'text',
  regexPattern,
  ...imaskProps
}: FormMaskedInputFieldProps<T>) {
  const lastValidRef = React.useRef<string>('')

  const {
    field,
    fieldState: { error }
  } = useController({ name, control })

  // inputMode'u güvenli şekilde alabilmek için imaskProps'u genişletiyoruz
  const imaskPropsWithInputMode = imaskProps as MaskBaseProps & {
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  }

  const resolvedInputMode: React.HTMLAttributes<HTMLInputElement>['inputMode'] =
    imaskPropsWithInputMode.inputMode ?? (type === 'number' ? 'numeric' : undefined)

  return (
    <FormItem className={formItemClassName}>
      {label && (
        <FormLabel htmlFor={name} className={cn('text-sm font-medium', error && 'text-red-500')}>
          {label}
          {required && <span className='ml-0.5'>*</span>}
        </FormLabel>
      )}

      <FormControl>
        <div className='relative w-full flex-1'>
          {Icon && (
            <div className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2'>
              <Icon className='size-4' />
            </div>
          )}

          <IMaskInput
            {...(imaskPropsWithInputMode as IMaskInputElementProps)}
            id={name}
            name={field.name}
            value={field.value ?? ''}
            onAccept={(val, mask) => {
              const unmasked = mask?.unmaskedValue ?? val
              const normalized = unmasked == null ? '' : String(unmasked)

              const digits = normalized.replace(/\D/g, '')

              if (digits.length > 0 && regexPattern && !regexPattern.test(digits)) {
                if (mask) mask.unmaskedValue = lastValidRef.current
                return
              }

              lastValidRef.current = digits
              field.onChange(digits)
            }}
            onBlur={field.onBlur}
            inputRef={field.ref}
            // native input props
            type='text' // IMaskInput ile her zaman text
            inputMode={resolvedInputMode}
            className={cn(
              inputVariants({ color, size, radius, variant, shadow }),
              Icon && 'pl-10',
              error && 'border-red-500',
              hideSpinButtons && 'no-spin',
              className
            )}
          />
        </div>
      </FormControl>

      {error && <FormMessage className='-mt-2'>{error.message}</FormMessage>}
    </FormItem>
  )
}
