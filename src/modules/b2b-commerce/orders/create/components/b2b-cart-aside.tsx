'use client'

import { B2BCartCheckoutSection, B2BCartHeader, B2BCartItemsList } from './b2b-cart-panel'

export function B2BCartAside() {
  return (
    <aside className='border-border/70 bg-card sticky top-20 hidden h-auto max-h-[calc(100vh-10rem)] w-80 shrink-0 flex-col overflow-hidden rounded-xl border shadow-sm xl:flex 2xl:w-84'>
      <B2BCartHeader compact />
      <div className='min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-3'>
        <B2BCartItemsList compact />
      </div>
      <div className='shrink-0'>
        <B2BCartCheckoutSection compact />
      </div>
    </aside>
  )
}
