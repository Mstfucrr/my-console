import { cn } from '@/lib/utils'

/** Sadece sayfa başlıkları: Başvuru Formu, Başarılı, Şifre Belirle, Şifreniz Başarıyla Belirlendi */
type OnboardingHeadingVariant = 'page' | 'success'

const variantTag: Record<OnboardingHeadingVariant, 'h1' | 'h3'> = {
  page: 'h1',
  success: 'h3'
}

export type OnboardingHeadingProps = {
  variant?: OnboardingHeadingVariant
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
}

export function OnboardingHeading({ variant = 'page', title, description, className }: OnboardingHeadingProps) {
  const Tag = variantTag[variant]
  const hasDescription = description != null

  return (
    <div className={cn(hasDescription && 'flex flex-col gap-0.5')}>
      {typeof title === 'string' ? (
        <Tag className={cn('text-primary-600 text-xl font-bold md:text-2xl', className)}>{title}</Tag>
      ) : (
        title
      )}
      {hasDescription && <p className='text-muted-foreground text-sm'>{description}</p>}
    </div>
  )
}
