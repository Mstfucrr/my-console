'use client'

import { Loader2 } from 'lucide-react'
import { Button, type ButtonProps } from './button'

type LoadingButtonProps = ButtonProps & {
  isLoading?: boolean
  loadingText?: string
  spinnerClassName?: string
}

const LoadingButton = ({
  isLoading = false,
  loadingText,
  children,
  disabled,
  spinnerClassName,
  ...props
}: LoadingButtonProps) => {
  const isDisabled = disabled || isLoading
  const content = isLoading && loadingText ? loadingText : children

  return (
    <Button disabled={isDisabled} {...props}>
      {isLoading && <Loader2 className={`mr-1 h-4 w-4 animate-spin ${spinnerClassName ?? ''}`} />}
      {content}
    </Button>
  )
}

LoadingButton.displayName = 'LoadingButton'

export { LoadingButton }
