import { z } from 'zod'
import { createOrderSchema } from '../constants'

export type CreateOrderFormData = z.infer<typeof createOrderSchema>
