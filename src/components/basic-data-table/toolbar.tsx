'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import type { Table } from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'
import type * as React from 'react'

type ToolbarProps<TData> = {
  table: Table<TData>
  enableColumnVisibility?: boolean
  searchable?: boolean
  searchValue?: string
  onSearchChange?: (v: string) => void
  searchPlaceholder?: string
  leftSlot?: React.ReactNode
  columnVisibilityTriggerProps?: React.ComponentProps<typeof Button>
}

export function DataTableToolbar<TData>({
  table,
  enableColumnVisibility = true,
  searchable = true,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Ara...',
  leftSlot,
  columnVisibilityTriggerProps
}: ToolbarProps<TData>) {
  return (
    <div className='flex flex-wrap items-center gap-2 px-2 sm:px-0'>
      <div className='mr-auto'>{leftSlot}</div>
      {searchable && (
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={e => onSearchChange?.(e.target.value)}
          className='h-10 max-w-sm min-w-[200px]'
        />
      )}

      {enableColumnVisibility && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' {...columnVisibilityTriggerProps}>
              Sütunlar
              <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='z-[9999]'>
            {table
              .getAllLeafColumns()
              .filter(column => column.getCanHide())
              .map(column => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={value => column.toggleVisibility(!!value)}
                >
                  {column.columnDef.header?.toString() ?? column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
