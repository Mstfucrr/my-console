'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

const Tabs = TabsPrimitive.Root

const TabsList = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  ref?: React.Ref<React.ComponentRef<typeof TabsPrimitive.List>>
}) => {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'bg-default-200 text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1',
        className
      )}
      {...props}
    />
  )
}
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
  ref?: React.Ref<React.ComponentRef<typeof TabsPrimitive.Trigger>>
}) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex h-full items-center justify-center rounded-sm px-3 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=active]:shadow-sm',
        className
      )}
      {...props}
    />
  )
}
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
  ref?: React.Ref<React.ComponentRef<typeof TabsPrimitive.Content>>
}) => {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className
      )}
      {...props}
    />
  )
}
TabsContent.displayName = TabsPrimitive.Content.displayName

interface TabsWithListProps<TValue extends string = string> {
  activeTab: TValue
  onValueChange: (value: TValue) => void
  items: { value: TValue; label: React.ReactNode; Icon?: LucideIcon; disabled?: boolean }[]
  className?: string
  triggerProps?: React.ComponentPropsWithoutRef<typeof TabsTrigger>
}

const TabsWithList = <TValue extends string = string>({
  activeTab,
  onValueChange,
  items,
  className,
  triggerProps
}: TabsWithListProps<TValue>) => {
  const handleValueChange = (value: string) => onValueChange(value as TValue)

  return (
    <Tabs value={activeTab} onValueChange={handleValueChange} className={className}>
      <TabsList>
        {items.map(item => {
          const Icon = item.Icon
          const label = item.label
          return (
            <TabsTrigger
              className='gap-2'
              key={item.value}
              value={item.value}
              disabled={item.disabled}
              {...triggerProps}
            >
              {Icon && <Icon className='size-4' />}
              {label}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
TabsWithList.displayName = 'TabsWithList'

export { Tabs, TabsContent, TabsList, TabsTrigger, TabsWithList }
