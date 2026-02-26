'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { Button, type ButtonProps } from './button'

type LoadingButtonProps = ButtonProps & {
  isLoading?: boolean
  loadingText?: string
  spinnerClassName?: string
  showContentWhenLoading?: boolean
}

const LoadingButton = ({
  isLoading = false,
  loadingText,
  children,
  disabled,
  spinnerClassName,
  showContentWhenLoading = true,
  ...props
}: LoadingButtonProps) => {
  const isDisabled = disabled || isLoading
  const content = isLoading && loadingText ? loadingText : children

  return (
    <Button disabled={isDisabled} className={cn('flex items-center gap-2', props.className)} {...props}>
      {isLoading && <Loader2 className={`size-4 animate-spin ${spinnerClassName ?? ''}`} />}
      {(showContentWhenLoading || !isLoading) && content}
    </Button>
  )
}

LoadingButton.displayName = 'LoadingButton'

export { LoadingButton }
