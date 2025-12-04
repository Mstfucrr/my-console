'use client'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const formContext = useFormContext()

  if (!formContext) {
    throw new Error('useFormField must be used within a FormProvider')
  }

  if (!fieldContext) {
    throw new Error('useFormField must be used within a <FormField>')
  }

  const { getFieldState, formState } = formContext

  const fieldState = getFieldState(fieldContext.name, formState)

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

const FormItem = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  )
}
FormItem.displayName = 'FormItem'

const FormLabel = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>) => {
  const { error, formItemId } = useFormField()

  return <Label className={cn(error && 'text-destructive', className)} htmlFor={formItemId} {...props} />
}
FormLabel.displayName = 'FormLabel'

const FormControl = ({ ...props }: React.ComponentPropsWithoutRef<typeof Slot>) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  )
}
FormControl.displayName = 'FormControl'

const FormDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  const { formDescriptionId } = useFormField()

  return <p id={formDescriptionId} className={cn('text-muted-foreground text-sm', className)} {...props} />
}
FormDescription.displayName = 'FormDescription'

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tooltip?: boolean
}
const FormMessage = ({ className, children, tooltip = false, ...props }: FormMessageProps) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      id={formMessageId}
      className={cn('text-destructive rounded-0.5 px-1.5 py-2 text-xs leading-none', className, {
        'bg-destructive text-destructive-foreground inline-block': tooltip
      })}
      {...props}
    >
      {body}
    </p>
  )
}
FormMessage.displayName = 'FormMessage'

export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField }
