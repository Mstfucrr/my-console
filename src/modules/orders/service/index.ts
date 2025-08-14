import { mockOrders } from '@/modules/mockData'
import type { FilterOptions, Order, PaginatedResponse, PaginationOptions } from '@/modules/types'

function matchesSearch(order: Order, search?: string) {
  if (!search) return true
  const q = search.toLowerCase().trim()
  return (
    order.id.toLowerCase().includes(q) ||
    order.customerName.toLowerCase().includes(q) ||
    order.customerPhone.toLowerCase().includes(q) ||
    order.customerAddress.toLowerCase().includes(q) ||
    order.restaurant.name.toLowerCase().includes(q)
  )
}

function withinDateRange(order: Order, from?: string, to?: string) {
  if (!from && !to) return true
  const created = new Date(order.createdAt).getTime()
  if (from && created < new Date(from).getTime()) return false
  if (to) {
    const end = new Date(to)
    end.setHours(23, 59, 59, 999)
    if (created > end.getTime()) return false
  }
  return true
}

function applyFilters(data: Order[], filters: FilterOptions): Order[] {
  const { status, search, dateFrom, dateTo } = filters
  return data.filter(o => {
    const statusOk =
      status === 'all' ? true : o.status === status || (Array.isArray(status) && status.includes(o.status))
    const searchOk = matchesSearch(o, search)
    const dateOk = withinDateRange(o, dateFrom, dateTo)
    return statusOk && searchOk && dateOk
  })
}

export const ordersService = {
  async getOrders(filters: FilterOptions, pagination: PaginationOptions): Promise<PaginatedResponse<Order>> {
    const filtered = applyFilters(mockOrders, filters)
    const total = filtered.length
    const start = (pagination.page - 1) * pagination.limit
    const end = start + pagination.limit
    const pageData = filtered.slice(start, end)
    // Simulate latency
    await new Promise(r => setTimeout(r, 3000))
    return {
      data: pageData,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.max(1, Math.ceil(total / pagination.limit))
    }
  }
}
