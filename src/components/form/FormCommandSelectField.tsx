import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandTrigger
} from '@/components/ui/command'
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useIsMobile } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { Check, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface FormCommandSelectFieldProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  placeholder?: string
  options: SelectOption[]
  searchPlaceholder?: string
  emptyMessage?: string
  formItemClassName?: string
  required?: boolean
  disabled?: boolean
  isLoading?: boolean
  onValueChange?: (value: string) => void
  tabIndex?: number
}

export function FormCommandSelectField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'Seçiniz...',
  options,
  searchPlaceholder = 'Ara...',
  emptyMessage = 'Sonuç bulunamadı.',
  formItemClassName,
  required,
  disabled,
  isLoading,
  onValueChange,
  tabIndex
}: FormCommandSelectFieldProps<T>) {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  const {
    field: { value, onChange },
    fieldState: { error }
  } = useController({ name, control })

  const selectedOption = options.find(option => option.value === value)

  return (
    <FormItem className={formItemClassName}>
      {label && (
        <FormLabel htmlFor={name} className={cn('text-sm font-medium', error && 'text-red-500')}>
          {label}
          {required && <span className='ml-0.5'>*</span>}
        </FormLabel>
      )}
      <FormControl>
        <Popover open={open} modal={!isMobile} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <CommandTrigger
              id={name}
              aria-expanded={open}
              className={cn(error && 'border-red-500', disabled && 'cursor-not-allowed opacity-50')}
              disabled={disabled}
              tabIndex={tabIndex}
            >
              <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </CommandTrigger>
          </PopoverTrigger>
          <PopoverContent
            className='w-full p-0'
            align='start'
            onOpenAutoFocus={e => {
              if (!isMobile) return
              e.preventDefault()
            }}
          >
            {isLoading ? (
              <div className='flex items-center justify-center p-2'>
                <Loader2 className='size-4 animate-spin' />
              </div>
            ) : (
              <Command>
                <CommandInput placeholder={searchPlaceholder} autoFocus={!isMobile} />
                <CommandList>
                  <CommandEmpty className='p-2 text-xs'>{emptyMessage}</CommandEmpty>
                  <CommandGroup className='max-h-[200px] overflow-y-auto'>
                    {options.map(option => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        keywords={[option.label, option.value]}
                        onSelect={selected => {
                          if (option.disabled) return
                          onChange(selected === value ? '' : selected)
                          onValueChange?.(selected)
                          setOpen(false)
                        }}
                        disabled={option.disabled}
                      >
                        <Check className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            )}
          </PopoverContent>
        </Popover>
      </FormControl>
      {error && <FormMessage className='-mt-2'>{error.message}</FormMessage>}
    </FormItem>
  )
}
