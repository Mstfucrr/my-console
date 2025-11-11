'use client'

import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  icon: LucideIcon
  iconColor?: string
  actions?: ReactNode
  onRefresh?: () => void
  isLoading?: boolean
  showRefreshButton?: boolean
  rightSide?: ReactNode
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  iconColor = 'text-primary',
  actions,
  onRefresh,
  isLoading = false,
  showRefreshButton = false,
  rightSide
}: PageHeaderProps) {
  return (
    <>
      <title>{`${title} - Partner`}</title>

      <Card className='max-sm:mt-5'>
        <CardHeader className='flex flex-row flex-wrap items-center justify-between gap-2'>
          <div>
            <CardTitle className='mb-1 flex items-center gap-2 text-2xl'>
              <Icon className={iconColor} />
              {title}
            </CardTitle>
            {description && <p className='text-muted-foreground text-sm'>{description}</p>}
          </div>
          <div className='flex items-center gap-2'>
            {actions}
            {rightSide}
            {showRefreshButton && onRefresh && (
              <RefreshButton size='xs' isIconButton onClick={onRefresh} isLoading={isLoading} />
            )}
          </div>
        </CardHeader>
      </Card>
    </>
  )
}
