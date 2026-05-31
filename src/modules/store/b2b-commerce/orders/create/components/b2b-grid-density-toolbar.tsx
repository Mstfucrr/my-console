'use client'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import type { B2BGridDensityOption } from '../hooks/useB2BGridDensity'

interface B2BGridDensityToolbarProps {
  options: B2BGridDensityOption[]
  columnCount: number
  onSelectCols: (cols: number) => void
}

export function B2BGridDensityToolbar({ options, columnCount, onSelectCols }: B2BGridDensityToolbarProps) {
  if (options.length === 1) return null
  return (
    <ButtonGroup>
      {options.map(option => {
        const Icon = option.icon
        const isActive = columnCount === option.cols
        return (
          <Button
            key={option.cols}
            type='button'
            variant={isActive ? undefined : 'outline'}
            size='icon-sm'
            className='shadow-xs'
            onClick={() => onSelectCols(option.cols)}
            aria-label={`${option.cols} sutun`}
            aria-pressed={isActive}
          >
            <Icon className='size-4' />
          </Button>
        )
      })}
    </ButtonGroup>
  )
}
