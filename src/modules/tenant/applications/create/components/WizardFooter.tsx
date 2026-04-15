import { Button } from '@/components/ui/button'

type WizardFooterProps = {
  onBack?: () => void
  backLabel?: string
  onPrimary?: () => void
  primaryLabel: string
  isPrimaryLoading?: boolean
  primaryType?: 'button' | 'submit'
}

export function WizardFooter({
  onBack,
  backLabel = 'Geri',
  onPrimary,
  primaryLabel,
  isPrimaryLoading,
  primaryType = 'button'
}: WizardFooterProps) {
  return (
    <div className='flex flex-wrap items-center justify-end gap-3'>
      {onBack && (
        <Button type='button' variant='ghost' onClick={onBack} className='text-muted-foreground'>
          {backLabel}
        </Button>
      )}
      <Button
        type={primaryType}
        color='success'
        size='sm'
        disabled={isPrimaryLoading}
        onClick={primaryType === 'button' ? onPrimary : undefined}
        className='min-w-[120px]'
      >
        {isPrimaryLoading ? 'İşleniyor...' : primaryLabel}
      </Button>
    </div>
  )
}
