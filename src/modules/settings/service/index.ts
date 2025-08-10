'use client'

import type {
  APILog,
  FiyuuPaymentType,
  PaginatedResponse,
  PaymentMapping,
  Webhook,
  WebhookEvent
} from '@/modules/types'

const LS_KEYS = {
  API_LOGS: 'cons:settings:apiLogs',
  WEBHOOKS: 'cons:settings:webhooks',
  MAPPINGS: 'cons:settings:paymentMappings'
}

function ensureSeed() {
  // Seed API Logs
  if (!localStorage.getItem(LS_KEYS.API_LOGS)) {
    const methods = ['GET', 'POST', 'PUT', 'DELETE'] as const
    const endpoints = ['/api/orders', '/api/orders/123', '/api/webhooks', '/api/webhooks/test', '/api/payments/map']
    const now = Date.now()
    const logs: APILog[] = Array.from({ length: 58 }).map((_, i) => {
      const ts = new Date(now - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toISOString()
      const method = methods[Math.floor(Math.random() * methods.length)]
      const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)]
      const statusChoices = [200, 201, 204, 400, 401, 404, 500, 502]
      const statusCode = statusChoices[Math.floor(Math.random() * statusChoices.length)]
      const responseTime = Math.floor(Math.random() * 1800) + 50
      return {
        id: `log_${i}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: ts,
        method,
        endpoint,
        statusCode,
        responseTime,
        request: JSON.stringify({ method, endpoint, payload: { sample: true, index: i } }, null, 2),
        response: JSON.stringify({ ok: statusCode >= 200 && statusCode < 300, code: statusCode }, null, 2)
      }
    })
    localStorage.setItem(LS_KEYS.API_LOGS, JSON.stringify(logs))
  }

  // Seed Webhooks
  if (!localStorage.getItem(LS_KEYS.WEBHOOKS)) {
    const webhooks: Webhook[] = [
      {
        id: 'wh_1',
        url: 'https://example.com/webhooks/fiyuu',
        events: ['order.status_changed', 'order.delivered'],
        isActive: true,
        lastTriggered: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: 'wh_2',
        url: 'https://example.com/webhooks/orders',
        events: ['order.created', 'order.cancelled'],
        isActive: true,
        lastTriggered: undefined,
        createdAt: new Date().toISOString()
      }
    ]
    localStorage.setItem(LS_KEYS.WEBHOOKS, JSON.stringify(webhooks))
  }

  // Seed Payment Mappings
  if (!localStorage.getItem(LS_KEYS.MAPPINGS)) {
    const mappings: PaymentMapping[] = [
      { id: 'pm_1', clientValue: 'nakit', fiyuuValue: 'cash', createdAt: new Date().toISOString() },
      { id: 'pm_2', clientValue: 'kredi_karti', fiyuuValue: 'card', createdAt: new Date().toISOString() },
      { id: 'pm_3', clientValue: 'online_odeme', fiyuuValue: 'online', createdAt: new Date().toISOString() }
    ]
    localStorage.setItem(LS_KEYS.MAPPINGS, JSON.stringify(mappings))
  }
}

function lsGet<T>(key: string): T {
  const raw = localStorage.getItem(key)
  return raw ? (JSON.parse(raw) as T) : ([] as unknown as T)
}

function lsSet<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const settingsService = {
  // API Logs
  async getLogs(
    filters: { success?: 'all' | 'true' | 'false'; endpoint?: string },
    page: number,
    pageSize: number
  ): Promise<PaginatedResponse<APILog>> {
    ensureSeed()
    let data = lsGet<APILog[]>(LS_KEYS.API_LOGS)
      .slice()
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))

    if (filters.success !== 'all') {
      data = data.filter(l =>
        filters.success === 'true' ? l.statusCode >= 200 && l.statusCode < 300 : l.statusCode >= 400
      )
    }
    if (filters.endpoint && filters.endpoint.trim()) {
      const q = filters.endpoint.toLowerCase()
      data = data.filter(l => l.endpoint.toLowerCase().includes(q))
    }

    const total = data.length
    const start = (page - 1) * pageSize
    const pageData = data.slice(start, start + pageSize)
    return { data: pageData, total, page, limit: pageSize, totalPages: Math.ceil(total / pageSize) }
  },

  // Webhooks
  async getWebhooks(): Promise<Webhook[]> {
    ensureSeed()
    return lsGet<Webhook[]>(LS_KEYS.WEBHOOKS)
  },
  async createWebhook(values: { url: string; events: WebhookEvent[]; isActive: boolean }): Promise<Webhook> {
    const all = await this.getWebhooks()
    const wh: Webhook = {
      id: `wh_${Math.random().toString(36).slice(2, 10)}`,
      url: values.url,
      events: values.events,
      isActive: values.isActive,
      lastTriggered: undefined,
      createdAt: new Date().toISOString()
    }
    all.push(wh)
    lsSet(LS_KEYS.WEBHOOKS, all)
    return wh
  },
  async updateWebhook(id: string, values: Partial<Pick<Webhook, 'url' | 'events' | 'isActive'>>): Promise<Webhook> {
    const all = await this.getWebhooks()
    const idx = all.findIndex(w => w.id === id)
    if (idx === -1) throw new Error('Webhook bulunamadı')
    all[idx] = { ...all[idx], ...values }
    lsSet(LS_KEYS.WEBHOOKS, all)
    return all[idx]
  },
  async deleteWebhook(id: string): Promise<void> {
    const all = await this.getWebhooks()
    lsSet(
      LS_KEYS.WEBHOOKS,
      all.filter(w => w.id !== id)
    )
  },

  // Payment mappings
  async getMappings(): Promise<PaymentMapping[]> {
    ensureSeed()
    return lsGet<PaymentMapping[]>(LS_KEYS.MAPPINGS)
  },
  async createMapping(values: { clientValue: string; fiyuuValue: FiyuuPaymentType }): Promise<PaymentMapping> {
    const all = await this.getMappings()
    const mp: PaymentMapping = {
      id: `pm_${Math.random().toString(36).slice(2, 10)}`,
      clientValue: values.clientValue,
      fiyuuValue: values.fiyuuValue,
      createdAt: new Date().toISOString()
    }
    all.push(mp)
    lsSet(LS_KEYS.MAPPINGS, all)
    return mp
  },
  async updateMapping(id: string, values: Partial<Pick<PaymentMapping, 'clientValue' | 'fiyuuValue'>>) {
    const all = await this.getMappings()
    const idx = all.findIndex(m => m.id === id)
    if (idx === -1) throw new Error('Eşleştirme bulunamadı')
    all[idx] = { ...all[idx], ...values }
    lsSet(LS_KEYS.MAPPINGS, all)
    return all[idx]
  },
  async deleteMapping(id: string) {
    const all = await this.getMappings()
    lsSet(
      LS_KEYS.MAPPINGS,
      all.filter(m => m.id !== id)
    )
  }
}
