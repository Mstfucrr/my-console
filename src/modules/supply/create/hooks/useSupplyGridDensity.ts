'use client'

import { useIsMobile, useIsSmallerThanTablet } from '@/hooks/use-media-query'
import { Columns2, Columns3, Columns4, Square, type LucideIcon } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

function clampToAllowed(count: number, allowed: number[]): number {
  if (allowed.length === 0) return count
  if (allowed.includes(count)) return count
  return allowed.reduce((best, n) => (Math.abs(n - count) < Math.abs(best - count) ? n : best), allowed[0])
}

export type SupplyGridDensityOption = { cols: number; icon: LucideIcon }

const mobileOptions: SupplyGridDensityOption[] = [
  { cols: 2, icon: Columns2 },
  { cols: 1, icon: Square }
]

const tabletOptions: SupplyGridDensityOption[] = [
  { cols: 3, icon: Columns3 },
  { cols: 2, icon: Columns2 }
]

const desktopOptions: SupplyGridDensityOption[] = [
  { cols: 4, icon: Columns4 },
  { cols: 3, icon: Columns3 }
]

function getGridClassName(cols: number) {
  switch (cols) {
    case 1:
      return 'grid-cols-1'
    case 2:
      return 'grid-cols-2'
    case 3:
      return 'grid-cols-3'
    case 4:
      return 'grid-cols-4'
    case 5:
      return 'grid-cols-5'
    default:
      return 'grid-cols-2'
  }
}

export function useSupplyGridDensity() {
  const isMobile = useIsMobile()
  const isSmallerThanTablet = useIsSmallerThanTablet()

  const options = useMemo(() => {
    if (isMobile) return mobileOptions
    if (isSmallerThanTablet) return tabletOptions
    return desktopOptions
  }, [isMobile, isSmallerThanTablet])

  const allowedCols = useMemo(() => options.map(o => o.cols), [options])

  const [userColumns, setUserColumns] = useState<number | null>(null)

  const columnCount = useMemo(
    () => clampToAllowed(userColumns ?? allowedCols[0] ?? 4, allowedCols),
    [allowedCols, userColumns]
  )

  const gridClassName = useMemo(() => {
    return getGridClassName(columnCount)
  }, [columnCount])

  const selectCols = useCallback((cols: number) => {
    setUserColumns(cols)
  }, [])

  return { gridClassName, options, columnCount, selectCols }
}
