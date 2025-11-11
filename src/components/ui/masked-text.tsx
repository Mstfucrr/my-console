'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface MaskedTextProps {
  /**
   * The value to display (will be masked or shown based on state)
   */
  value: string
  /**
   * Function to mask the value
   */
  maskFn: (value: string) => string
  /**
   * Whether the value should be masked by default
   * @default true
   */
  defaultMasked?: boolean
  /**
   * Additional className for the container
   */
  className?: string
  /**
   * Whether to render as a link
   */
  asLink?: boolean
  /**
   * href for the link (required if asLink is true)
   */
  href?: string
  /**
   * Additional className for the text/link element
   */
  textClassName?: string
  /**
   * Size of the toggle button
   */
  buttonSize?: 'xs' | 'sm' | 'default'
}

/**
 * Generic component for displaying masked text with toggle visibility
 */
export function MaskedText({
  value,
  maskFn,
  defaultMasked = true,
  className,
  asLink = false,
  href,
  textClassName,
  buttonSize = 'xs'
}: MaskedTextProps) {
  const [isMasked, setIsMasked] = useState(defaultMasked)

  const displayValue = isMasked ? maskFn(value) : value

  const toggleMask = () => {
    setIsMasked(prev => !prev)
  }

  const content =
    asLink && href ? (
      <a href={href} className={textClassName}>
        {displayValue}
      </a>
    ) : (
      <span className={textClassName}>{displayValue}</span>
    )

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {content}
      <Button
        size={buttonSize}
        variant='ghost'
        onClick={toggleMask}
        className='h-6 w-6 p-0'
        aria-label={isMasked ? 'Göster' : 'Gizle'}
        type='button'
      >
        {isMasked ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
      </Button>
    </div>
  )
}
