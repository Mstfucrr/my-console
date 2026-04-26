'use client'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import type { SupplyGridDensityOption } from '../hooks/useSupplyGridDensity'

interface SupplyGridDensityToolbarProps {
  options: SupplyGridDensityOption[]
  columnCount: number
  onSelectCols: (cols: number) => void
}

export function SupplyGridDensityToolbar({ options, columnCount, onSelectCols }: SupplyGridDensityToolbarProps) {
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
