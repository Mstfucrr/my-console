import * as React from 'react'

import { cn } from '@/lib/utils'

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  wrapperClass?: string
}
const Table = ({ className, wrapperClass, ...props }: TableProps) => (
  <div className={cn('overflow-x-auto', wrapperClass)}>
    <table className={cn('w-full caption-top text-sm', className)} {...props} />
  </div>
)
Table.displayName = 'Table'

const TableHeader = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn('[&_tr]:border-b', className)} {...props} />
)
TableHeader.displayName = 'TableHeader'

const TableBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
)
TableBody.displayName = 'TableBody'

const TableFooter = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot className={cn('bg-muted font-medium', className)} {...props} />
)
TableFooter.displayName = 'TableFooter'

const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={cn('border-default-300 data-[state=selected]:bg-muted border-b transition-colors', className)}
    {...props}
  />
)
TableRow.displayName = 'TableRow'

const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      'text-default-800 h-14 px-4 align-middle text-sm font-semibold capitalize ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left ltr:[&:has([role=checkbox])]:pr-0 rtl:[&:has([role=checkbox])]:pl-0',
      className
    )}
    {...props}
  />
)
TableHead.displayName = 'TableHead'

const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={cn(
      'text-default-600 p-4 align-middle text-sm font-normal last:text-right rtl:last:text-left ltr:[&:has([role=checkbox])]:pr-0 rtl:[&:has([role=checkbox])]:pl-0',
      className
    )}
    {...props}
  />
)
TableCell.displayName = 'TableCell'

const TableCaption = ({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) => (
  <caption className={cn('text-default-700 mb-4 text-start text-sm font-medium', className)} {...props} />
)
TableCaption.displayName = 'TableCaption'

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow }
