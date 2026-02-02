'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { useIsSmallerThanTablet } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'
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
  href?: Route
  /**
   * Additional className for the text/link element
   */
  textClassName?: string
  /**
   * Size of the toggle button
   */
  buttonSize?: ButtonProps['size']
}

/**
 * Generic component for displaying masked text with hold-to-show visibility
 */
export function MaskedText({
  value,
  maskFn,
  defaultMasked = true,
  className,
  asLink = false,
  href,
  textClassName,
  buttonSize = 'icon-xs'
}: MaskedTextProps) {
  const isSmallerThanTablet = useIsSmallerThanTablet()
  const [isMasked, setIsMasked] = useState(defaultMasked)

  // Hold-to-show handlers
  const showUnmasked = () => setIsMasked(false)
  const hideMasked = () => setIsMasked(true)

  const displayValue = isMasked ? maskFn(value) : value

  if (!displayValue.length) return null

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {asLink && href ? (
        <Link href={href} className={textClassName}>
          {displayValue}
        </Link>
      ) : (
        <span className={textClassName}>{displayValue}</span>
      )}
      {isSmallerThanTablet ? (
        <Button
          size={buttonSize}
          variant='ghost'
          className='size-6! min-h-6 min-w-6 p-0'
          aria-label={isMasked ? 'Göster' : 'Gizle'}
          type='button'
          onClick={e => {
            e.stopPropagation()
            setIsMasked(masked => !masked)
          }}
          tabIndex={0}
        >
          {isMasked ? <EyeOff className='size-4.5' /> : <Eye className='size-4.5' />}
        </Button>
      ) : (
        <span
          aria-label={isMasked ? 'Göster' : 'Gizle'}
          className='hover:bg-primary hover:text-primary-foreground text-primary rounded-md p-1'
          onMouseEnter={e => {
            e.stopPropagation()
            showUnmasked()
          }}
          onMouseLeave={e => {
            e.stopPropagation()
            hideMasked()
          }}
          tabIndex={0}
        >
          {isMasked ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
        </span>
      )}
    </div>
  )
}
