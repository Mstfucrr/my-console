import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Check, ChevronDown, Loader2, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
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
  allowCustomValue?: boolean // true: custom yazmaya izin ver, false: sadece select seçimi
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
  tabIndex,
  allowCustomValue = false
}: FormCommandSelectFieldProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    field: { value, onChange },
    fieldState: { error }
  } = useController({ name, control })

  const selectedOption = options.find(option => option.value === value)

  const handleSelect = (selected: string) => {
    const option = !allowCustomValue
      ? options.find(opt => opt.label === selected || opt.value === selected)
      : { value: selected, label: selected, disabled: false }
    if (!option || option.disabled) return

    onChange(option.value === value ? '' : option.value)
    onValueChange?.(option.value)
    setSearchValue('')
    setIsOpen(false)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
    if (selectedOption) {
      setSearchValue(selectedOption.label)
    } else if (allowCustomValue && value) {
      setSearchValue(value)
    }

    // Select first item when opening
    requestAnimationFrame(() => {
      const commandList = containerRef.current?.querySelector('[cmdk-list]')
      if (commandList) {
        const firstItem = commandList.querySelector('[cmdk-item]:not([data-disabled="true"])') as HTMLElement
        if (firstItem) {
          const items = Array.from(
            commandList.querySelectorAll('[cmdk-item]:not([data-disabled="true"])')
          ) as HTMLElement[]
          items.forEach(item => item.setAttribute('aria-selected', 'false'))
          firstItem.setAttribute('aria-selected', 'true')
        }
      }
    })
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || disabled) return

    const commandList = containerRef.current?.querySelector('[cmdk-list]')
    if (!commandList) return

    const items = Array.from(commandList.querySelectorAll('[cmdk-item]:not([data-disabled="true"])')) as HTMLElement[]
    if (items.length === 0) return

    const activeItem = commandList.querySelector('[cmdk-item][aria-selected="true"]') as HTMLElement
    const activeIndex = activeItem ? items.indexOf(activeItem) : -1

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        const nextIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0
        items.forEach(item => item.setAttribute('aria-selected', 'false'))
        items[nextIndex]?.setAttribute('aria-selected', 'true')
        items[nextIndex]?.scrollIntoView({ block: 'nearest' })
        break

      case 'ArrowUp':
        e.preventDefault()
        const prevIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1
        items.forEach(item => item.setAttribute('aria-selected', 'false'))
        items[prevIndex]?.setAttribute('aria-selected', 'true')
        items[prevIndex]?.scrollIntoView({ block: 'nearest' })
        break

      case 'Enter':
        e.preventDefault()
        const itemToSelect = activeItem || items[0]
        if (itemToSelect) {
          const optionValue = itemToSelect.getAttribute('data-value')
          const optionLabel = itemToSelect.textContent?.trim()
          if (optionValue || optionLabel) {
            handleSelect(optionValue || optionLabel || '')
          }
        }
        break

      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSearchValue('')
        inputRef.current?.blur()
        break
    }
  }

  const handleInputBlur = (e: React.FocusEvent) => {
    setTimeout(() => {
      if (!containerRef.current?.contains(e.relatedTarget as Node)) {
        setIsOpen(false)

        if (allowCustomValue && searchValue.trim() && value) {
          const matchingOption = options.find(
            opt =>
              opt.label.toLowerCase() === searchValue.trim().toLowerCase() ||
              opt.value.toLowerCase() === searchValue.trim().toLowerCase()
          )
          onChange(matchingOption ? matchingOption.value : searchValue.trim())
          onValueChange?.(matchingOption ? matchingOption.value : searchValue.trim())
        }

        setSearchValue('')
      }
    }, 200)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)

    if (!isOpen) setIsOpen(true)

    if (allowCustomValue) {
      onChange(newValue)
      onValueChange?.(newValue)
    } else if (newValue === '') {
      onChange('')
      onValueChange?.('')
    }

    // Select first filtered item
    requestAnimationFrame(() => {
      const commandList = containerRef.current?.querySelector('[cmdk-list]')
      if (commandList) {
        const items = Array.from(
          commandList.querySelectorAll('[cmdk-item]:not([data-disabled="true"])')
        ) as HTMLElement[]
        items.forEach(item => item.setAttribute('aria-selected', 'false'))
        if (items[0]) {
          items[0].setAttribute('aria-selected', 'true')
        }
      }
    })
  }

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange('')
    onValueChange?.('')
    setSearchValue('')
    setIsOpen(false)
  }

  const getDisplayValue = () => {
    if (isOpen) return searchValue
    if (selectedOption) return selectedOption.label
    if (allowCustomValue && value) return value
    return ''
  }

  const filteredOptions = useMemo(
    () =>
      options.filter(option => {
        if (!searchValue) return true
        const search = searchValue.toLocaleLowerCase('tr-TR')
        return (
          option.label.toLocaleLowerCase('tr-TR').includes(search) ||
          option.value.toLocaleLowerCase('tr-TR').includes(search)
        )
      }),
    [options, searchValue]
  )

  return (
    <FormItem className={formItemClassName}>
      {label && (
        <FormLabel htmlFor={name} className={cn('text-sm font-medium', error && 'text-red-500')}>
          {label}
          {required && <span className='ml-0.5'>*</span>}
        </FormLabel>
      )}
      <FormControl>
        <div ref={containerRef} className='relative w-full'>
          <div className='relative'>
            <Input
              ref={inputRef}
              inputMode='search'
              id={name}
              name={name}
              placeholder={isOpen ? searchPlaceholder : placeholder}
              value={getDisplayValue()}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              disabled={disabled}
              tabIndex={tabIndex}
              autoComplete='off'
              className={cn(
                'h-9',
                selectedOption || (allowCustomValue && value) ? 'pr-20' : 'pr-10',
                error && 'border-red-500',
                disabled && 'cursor-not-allowed opacity-50',
                !selectedOption && !isOpen && !value && 'text-muted-foreground'
              )}
            />
            <div className='absolute top-1/2 right-3 z-10 flex -translate-y-1/2 items-center gap-1'>
              {(selectedOption || (allowCustomValue && value)) && !disabled && (
                <button
                  type='button'
                  onClick={handleClear}
                  onMouseDown={e => {
                    e.preventDefault()
                    handleClear(e)
                  }}
                  className='hover:bg-accent pointer-events-auto rounded-sm p-0.5 transition-colors'
                  tabIndex={-1}
                >
                  <X className='text-muted-foreground hover:text-foreground size-3.5' />
                </button>
              )}
              <div className='pointer-events-none'>
                <ChevronDown
                  onMouseDown={e => {
                    e.preventDefault()
                    handleInputFocus()
                  }}
                  className={cn('text-muted-foreground size-4 transition-transform', isOpen && 'rotate-180')}
                />
              </div>
            </div>
          </div>
          {isOpen && !disabled && (
            <div className='bg-popover absolute z-50 mt-1 w-full rounded-md border shadow-md'>
              {isLoading ? (
                <div className='flex items-center justify-center p-4'>
                  <Loader2 className='size-4 animate-spin' />
                </div>
              ) : (
                <Command shouldFilter={false}>
                  <div className='hidden'>
                    <CommandInput value={searchValue} onValueChange={setSearchValue} />
                  </div>
                  <CommandList>
                    {filteredOptions.length === 0 && searchValue && !allowCustomValue && (
                      <CommandEmpty className='py-6 text-center text-sm'>{emptyMessage}</CommandEmpty>
                    )}
                    <CommandGroup className='max-h-[200px] overflow-y-auto'>
                      {allowCustomValue && filteredOptions.length === 0 && searchValue.trim() !== '' && (
                        <CommandItem
                          key='custom'
                          onSelect={() => handleSelect(searchValue.trim())}
                          onMouseDown={e => {
                            e.preventDefault()
                            handleSelect(searchValue.trim())
                          }}
                          value={searchValue}
                          data-value={searchValue}
                          className='cursor-pointer'
                        >
                          <Check className='mr-2 size-4' />
                          {searchValue}
                        </CommandItem>
                      )}
                      {filteredOptions.map(option => (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onSelect={() => handleSelect(option.value)}
                          onMouseDown={e => {
                            e.preventDefault()
                            handleSelect(option.value)
                          }}
                          disabled={option.disabled}
                          data-value={option.value}
                        >
                          <Check className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              )}
            </div>
          )}
        </div>
      </FormControl>
      {error && <FormMessage className='-mt-2'>{error.message}</FormMessage>}
    </FormItem>
  )
}
