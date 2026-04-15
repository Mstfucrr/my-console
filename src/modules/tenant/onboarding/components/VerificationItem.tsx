'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckCircle, type LucideIcon } from 'lucide-react'

type VerificationItemProps = {
  Icon: LucideIcon
  title: string
  value: string
  isVerified: boolean
  onVerify: () => void
}

function toTestId(value: string) {
  return value.toLocaleLowerCase('tr-TR').replace(/\s+/g, '-')
}

export function VerificationItem({ Icon, title, value, isVerified, onVerify }: VerificationItemProps) {
  const testId = toTestId(title)

  return (
    <div
      className='bg-card flex w-full items-center gap-2 self-center rounded-md p-4 pl-3 shadow-md lg:w-[420px]'
      data-testid={`onboarding-${testId}-item`}
    >
      <div className='flex w-10 justify-center sm:w-12'>
        <Icon className='text-primary size-6' />
      </div>
      <div className='flex flex-col gap-1'>
        <p className='text-sm font-medium'>{title}</p>
        <p className='text-sm break-all'>{value}</p>
      </div>
      <Button
        variant={isVerified ? 'ghost' : 'outline'}
        color={isVerified ? 'success' : 'default'}
        className={cn('ml-auto min-w-min text-xs', isVerified && 'font-extrabold')}
        disabled={isVerified}
        onClick={onVerify}
        data-testid={`${testId}-button`}
      >
        {isVerified && <CheckCircle className='mr-2 size-4.5' />}
        {isVerified ? 'Doğrulandı' : 'Doğrula'}
      </Button>
    </div>
  )
}
