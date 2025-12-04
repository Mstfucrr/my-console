'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import * as React from 'react'

export interface ConfirmButtonProps extends ButtonProps {
  /**
   * The text to display on the button
   */
  children: React.ReactNode
  /**
   * The content to display in the confirmation popover
   * @default "Emin misiniz?"
   */
  confirmationMessage?: React.ReactNode
  /**
   * The text for the confirm action button
   * @default "Evet"
   */
  confirmButtonMessage?: React.ReactNode
  /**
   * The text for the cancel action button
   * @default "Hayır"
   */
  cancelButtonMessage?: React.ReactNode
  /**
   * The variant for the confirm button
   * @default "destructive"
   */
  confirmButtonVariant?: ButtonProps['variant']
  /**
   * The color for the confirm button
   * @default "success"
   */
  confirmButtonColor?: ButtonProps['color']
  /**
   * The variant for the cancel button
   * @default "outline"
   */
  confirmButtonProps?: ButtonProps
  cancelButtonVariant?: ButtonProps['variant']
  /**
   * The color for the cancel button
   * @default "destructive"
   */
  cancelButtonColor?: ButtonProps['color']
  /**
   * Callback function when the confirm button is clicked
   */
  cancelButtonProps?: ButtonProps
  onConfirm?: () => void
}

export function ConfirmButton({
  children,
  confirmationMessage = 'Emin misiniz?',
  confirmButtonMessage = 'Evet',
  cancelButtonMessage = 'Hayır',
  confirmButtonVariant,
  confirmButtonColor = 'success',
  confirmButtonProps,
  cancelButtonVariant = 'outline',
  cancelButtonProps,
  cancelButtonColor = 'destructive',
  onConfirm,
  className,
  variant,
  ...props
}: ConfirmButtonProps) {
  const [open, setOpen] = React.useState(false)

  const handleConfirm = () => {
    onConfirm?.()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={variant} className={className} {...props}>
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-4' mountInsideDialog={false} side='top' align='center'>
        <div className='space-y-4'>
          <div className='text-center text-sm font-medium'>{confirmationMessage}</div>
          <div className='flex justify-center space-x-2'>
            <Button
              variant={cancelButtonVariant}
              size='xs'
              onClick={() => setOpen(false)}
              color={cancelButtonColor}
              {...cancelButtonProps}
            >
              {cancelButtonMessage}
            </Button>
            <Button
              variant={confirmButtonVariant}
              size='xs'
              onClick={handleConfirm}
              color={confirmButtonColor}
              {...confirmButtonProps}
            >
              {confirmButtonMessage}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
