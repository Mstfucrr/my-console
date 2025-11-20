export interface OrderFilterProperties {
  status: 'all' | 'created' | 'shipped' | 'delivered' | 'cancelled'
  search?: string
}

