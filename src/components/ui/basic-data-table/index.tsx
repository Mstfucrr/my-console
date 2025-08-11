'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState
} from '@tanstack/react-table'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import * as React from 'react'
import { Button } from '../button'
import { DataTablePagination } from './pagination'
import { DataTableToolbar } from './toolbar'

export type BasicDataTableProps<TData, TValue = never> = {
  // data and columns
  columns: ColumnDef<TData, TValue>[]
  data: TData[]

  // appearance
  className?: string
  tableClassName?: string
  toolbar?: React.ReactNode

  // filtering
  searchableColumn?: string // column id to attach the search input to
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void

  // column visibility
  enableColumnVisibility?: boolean

  // row selection
  enableRowSelection?: boolean
  selectedRowIds?: Record<string, boolean>
  onRowSelectionChange?: (updater: Record<string, boolean>) => void

  // sorting and filters (controlled optional)
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (visibility: VisibilityState) => void

  // pagination
  // If total is provided, pagination is treated as manual (server-side)
  page?: number
  pageSize?: number
  total?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void

  // loading
  isLoading?: boolean

  // empty & loading labels
  emptyLabel?: string
  loadingLabel?: string

  // column visibility trigger props
  columnVisibilityTriggerProps?: React.ComponentProps<typeof Button>
}

function TableOverlayLoader({ label }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className='absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-xs transition-all'
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className='flex items-center gap-3 rounded-md px-4 py-2 shadow-md'
      >
        <Loader2 className='text-primary size-8 animate-spin' />
        {label && <span className='text-primary text-base font-medium'>{label}</span>}
      </motion.div>
    </motion.div>
  )
}

export function BasicDataTable<TData extends { id?: string }, TValue = never>({
  columns,
  data,
  className,
  tableClassName,
  toolbar,
  searchableColumn,
  searchPlaceholder = 'Ara...',
  searchValue,
  onSearchChange,
  enableColumnVisibility = true,
  enableRowSelection = false,
  selectedRowIds,
  onRowSelectionChange,
  sorting,
  onSortingChange,
  columnFilters,
  onColumnFiltersChange,
  columnVisibility,
  onColumnVisibilityChange,
  page = 1,
  pageSize = 10,
  total,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  emptyLabel = 'Kayıt bulunamadı',
  loadingLabel = 'Yükleniyor...',
  columnVisibilityTriggerProps
}: BasicDataTableProps<TData, TValue>) {
  // Optional built-in selection column
  const computedColumns = React.useMemo(() => {
    if (!enableRowSelection) return columns
    const selectCol: ColumnDef<TData, TValue> = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false
    }
    return [selectCol, ...columns]
  }, [columns, enableRowSelection])

  const manualPagination = typeof total === 'number'
  const [internalSorting, setInternalSorting] = React.useState<SortingState>(sorting ?? [])
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>(columnFilters ?? [])
  const [internalColumnVisibility, setInternalColumnVisibility] = React.useState<VisibilityState>(
    columnVisibility ?? {}
  )
  const [internalRowSelection, setInternalRowSelection] = React.useState<Record<string, boolean>>(selectedRowIds ?? {})

  const table = useReactTable({
    data,
    columns: computedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination,
    pageCount: manualPagination ? Math.max(1, Math.ceil((total ?? 0) / pageSize)) : undefined,
    onPaginationChange: updater => {
      const current: PaginationState = { pageIndex: page - 1, pageSize }
      const next = typeof updater === 'function' ? updater(current) : updater
      onPageChange?.(next.pageIndex + 1)
      onPageSizeChange?.(next.pageSize)
    },
    // sorting
    onSortingChange: updater => {
      const next = typeof updater === 'function' ? updater(internalSorting) : updater
      setInternalSorting(next)
      onSortingChange?.(next)
    },
    // filters
    onColumnFiltersChange: updater => {
      const next = typeof updater === 'function' ? updater(internalColumnFilters) : updater
      setInternalColumnFilters(next)
      onColumnFiltersChange?.(next)
    },
    // visibility
    onColumnVisibilityChange: updater => {
      const next = typeof updater === 'function' ? updater(internalColumnVisibility) : updater
      setInternalColumnVisibility(next)
      onColumnVisibilityChange?.(next)
    },
    // selection
    onRowSelectionChange: updater => {
      const next = typeof updater === 'function' ? updater(internalRowSelection) : updater
      setInternalRowSelection(next)
      onRowSelectionChange?.(next)
    },
    state: {
      // pagination is controlled when manual
      pagination: { pageIndex: page - 1, pageSize },
      sorting: sorting ?? internalSorting,
      columnFilters: columnFilters ?? internalColumnFilters,
      columnVisibility: columnVisibility ?? internalColumnVisibility,
      rowSelection: selectedRowIds ?? internalRowSelection
    }
  })

  const totalPages = manualPagination ? Math.max(1, Math.ceil((total ?? 0) / pageSize)) : table.getPageCount()
  const canPrev = manualPagination ? page > 1 : table.getCanPreviousPage()
  const canNext = manualPagination ? page < totalPages : table.getCanNextPage()

  // Search binding to a specific column
  const searchColumn = searchableColumn ? table.getColumn(searchableColumn) : undefined
  const inputValue = typeof searchValue !== 'undefined' ? searchValue : (searchColumn?.getFilterValue() as string) || ''

  const handleSearchChange = (value: string) => {
    if (onSearchChange) onSearchChange(value)
    if (searchColumn) searchColumn.setFilterValue(value)
  }

  // Yeni: Loader'ı data varsa ve isLoading ise tablo üstüne absolute olarak göster
  const showOverlayLoader = isLoading && data && data.length > 0

  return (
    <div className={cn('space-y-3', className)}>
      <DataTableToolbar
        table={table}
        enableColumnVisibility={enableColumnVisibility}
        searchable={Boolean(searchableColumn)}
        searchValue={inputValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder={searchPlaceholder}
        leftSlot={toolbar}
        columnVisibilityTriggerProps={{
          ...columnVisibilityTriggerProps
        }}
      />

      <div className={cn('relative rounded-md border', tableClassName)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className='text-left'>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading && (!data || data.length === 0) ? (
              <TableRow>
                <TableCell colSpan={computedColumns.length} className='text-muted-foreground h-24 text-center'>
                  <div className='flex items-center justify-center gap-2'>
                    <Loader2 className='size-5 animate-spin' />
                    {loadingLabel}
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className='hover:bg-muted/40'>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={computedColumns.length} className='text-muted-foreground h-24 text-center'>
                  {emptyLabel}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <AnimatePresence>{showOverlayLoader && <TableOverlayLoader label={loadingLabel} />}</AnimatePresence>
      </div>

      <DataTablePagination
        page={manualPagination ? page : table.getState().pagination.pageIndex + 1}
        totalPages={totalPages}
        canPrev={canPrev}
        canNext={canNext}
        onPrev={() => (manualPagination ? onPageChange?.(page - 1) : table.previousPage())}
        onNext={() => (manualPagination ? onPageChange?.(page + 1) : table.nextPage())}
        onPageClick={p => (manualPagination ? onPageChange?.(p) : table.setPageIndex(p - 1))}
        leftInfo={
          manualPagination
            ? `${(page - 1) * pageSize + (data.length ? 1 : 0)}-${Math.min(page * pageSize, total ?? 0)} / ${total ?? 0}`
            : undefined
        }
      />
    </div>
  )
}

// Helpers
export function createSelectableColumns<TData, TValue = never>(
  columns: ColumnDef<TData, TValue>[]
): ColumnDef<TData, TValue>[] {
  const selectCol: ColumnDef<TData, TValue> = {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select'
      />
    ),
    enableSorting: false,
    enableHiding: false
  }
  return [selectCol, ...columns]
}

export default BasicDataTable
