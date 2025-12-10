'use client'
import { SupportDialog } from '../common/support-dialog'

export function MobileMenu() {
  return (
    <div className='fixed bottom-20 left-5 z-50'>
      <SupportDialog />
    </div>
  )
}
