'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type OtpCodeInputProps = {
  values: string[]
  inputRefs: React.MutableRefObject<Array<HTMLInputElement | null>>
  onChange: (index: number, value: string) => void
  onPaste: (index: number, value: string) => void
  onKeyDown: (index: number, event: React.KeyboardEvent<HTMLInputElement>) => void
  disabled?: boolean
  className?: string
  inputClassName?: string
}

export function OtpCodeInput({
  values,
  inputRefs,
  onChange,
  onPaste,
  onKeyDown,
  disabled = false,
  className,
  inputClassName
}: OtpCodeInputProps) {
  return (
    <div className={cn('flex justify-center gap-2 text-center', className)}>
      {values.map((value, index) => (
        <Input
          key={`otp-code-${index}`}
          type='text'
          id={`otp${index}`}
          name={`otp${index}`}
          value={value}
          onChange={e => onChange(index, e.target.value)}
          onPaste={e => onPaste(index, e.clipboardData.getData('text'))}
          onKeyDown={event => onKeyDown(index, event)}
          disabled={disabled}
          autoFocus={index === 0}
          maxLength={1}
          className={cn(
            'focus:border-primary no-spin max-xs:size-10 size-12 rounded-lg border-2 text-center text-xl font-semibold',
            inputClassName
          )}
          ref={(ref: HTMLInputElement | null) => {
            inputRefs.current[index] = ref
          }}
          inputMode='numeric'
          pattern='[0-9]*'
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
        />
      ))}
    </div>
  )
}
