'use client'

import { useProfile } from '@/context/ProfileProvider'
import type { AxiosError } from 'axios'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { toast } from 'react-toastify'
import type { B2BProduct } from '../../../types'
import { getB2BUnitPrice } from '../../../utils/b2b-price'
import { MIN_B2B_ORDER_AMOUNT } from '../constants'
import { useB2BCart } from '../hooks/useB2BCart'
import { useCreateB2BOrderMutation } from '../hooks/useCreateB2BOrderMutation'

type OrderResult = {
  orderId: string
  message: string
}

type B2BCheckoutContextValue = {
  cart: ReturnType<typeof useB2BCart>['cart']
  cartItemCount: number
  cartTotal: number
  canOrder: boolean
  addToCart: (product: B2BProduct) => void
  updateQuantity: (productId: string, quantity: number) => void
  getCartQuantity: (productId: string) => number
  clearCart: () => void
  restaurantAddress: string
  selectedDeliveryAddress: string
  selectDeliveryAddress: (address: string) => void
  isCartSheetOpen: boolean
  isAddressDialogOpen: boolean
  isOrderConfirmOpen: boolean
  orderResult: OrderResult | null
  isSubmitting: boolean
  openCartSheet: () => void
  closeCartSheet: () => void
  openAddressDialog: () => void
  closeAddressDialog: () => void
  openOrderConfirm: () => void
  closeOrderConfirm: () => void
  closeOrderResult: () => void
  submitOrder: () => Promise<void>
}

const B2BCheckoutContext = createContext<B2BCheckoutContextValue | null>(null)

export function B2BCheckoutProvider({ children }: { children: ReactNode }) {
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false)
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [isOrderConfirmOpen, setIsOrderConfirmOpen] = useState(false)
  const [customDeliveryAddress, setCustomDeliveryAddress] = useState('')
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null)

  const { profile } = useProfile()
  const { cart, addToCart, updateQuantity, getCartQuantity, cartItemCount, clearCart } = useB2BCart()
  const createB2BOrderMutation = useCreateB2BOrderMutation()

  const restaurantAddress = profile?.info?.address?.trim() || ''
  const selectedDeliveryAddress = customDeliveryAddress || restaurantAddress
  const isSubmitting = createB2BOrderMutation.isPending

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + getB2BUnitPrice(item.product) * item.quantity, 0),
    [cart]
  )

  const canOrder = useMemo(
    () => cartTotal >= MIN_B2B_ORDER_AMOUNT && cart.length > 0 && selectedDeliveryAddress !== '' && !isSubmitting,
    [cartTotal, cart.length, selectedDeliveryAddress, isSubmitting]
  )

  const selectDeliveryAddress = useCallback(
    (address: string) => {
      setCustomDeliveryAddress(address === restaurantAddress ? '' : address)
    },
    [restaurantAddress]
  )

  const openCartSheet = useCallback(() => setIsCartSheetOpen(true), [])
  const closeCartSheet = useCallback(() => setIsCartSheetOpen(false), [])
  const openAddressDialog = useCallback(() => setIsAddressDialogOpen(true), [])
  const closeAddressDialog = useCallback(() => setIsAddressDialogOpen(false), [])
  const closeOrderConfirm = useCallback(() => setIsOrderConfirmOpen(false), [])
  const closeOrderResult = useCallback(() => setOrderResult(null), [])

  const openOrderConfirm = useCallback(() => {
    if (!canOrder) return
    setIsCartSheetOpen(false)
    setIsOrderConfirmOpen(true)
  }, [canOrder])

  const submitOrder = useCallback(async () => {
    if (!canOrder) return

    const result = await toast.promise(
      async () =>
        await createB2BOrderMutation.mutateAsync({
          items: cart.map(item => ({ productId: item.product.id, quantity: item.quantity })),
          address: selectedDeliveryAddress
        }),
      {
        pending: 'Sipariş oluşturuluyor...',
        success: {
          render: ({ data }: { data: OrderResult }) => data?.message ?? 'Sipariş başarıyla oluşturuldu'
        },
        error: {
          render: ({ data }: { data: AxiosError<{ message?: string }> }) =>
            data?.response?.data?.message ?? 'Sipariş oluşturulurken bir hata oluştu'
        }
      }
    )

    clearCart()
    setIsCartSheetOpen(false)
    setIsOrderConfirmOpen(false)
    setOrderResult(result)
  }, [canOrder, cart, clearCart, createB2BOrderMutation, selectedDeliveryAddress])

  const value = useMemo<B2BCheckoutContextValue>(
    () => ({
      cart,
      cartItemCount,
      cartTotal,
      canOrder,
      addToCart,
      updateQuantity,
      getCartQuantity,
      clearCart,
      restaurantAddress,
      selectedDeliveryAddress,
      selectDeliveryAddress,
      isCartSheetOpen,
      isAddressDialogOpen,
      isOrderConfirmOpen,
      orderResult,
      isSubmitting,
      openCartSheet,
      closeCartSheet,
      openAddressDialog,
      closeAddressDialog,
      openOrderConfirm,
      closeOrderConfirm,
      closeOrderResult,
      submitOrder
    }),
    [
      addToCart,
      canOrder,
      cart,
      cartItemCount,
      cartTotal,
      clearCart,
      closeAddressDialog,
      closeCartSheet,
      closeOrderConfirm,
      closeOrderResult,
      getCartQuantity,
      isAddressDialogOpen,
      isCartSheetOpen,
      isOrderConfirmOpen,
      isSubmitting,
      openAddressDialog,
      openCartSheet,
      openOrderConfirm,
      orderResult,
      submitOrder,
      restaurantAddress,
      selectDeliveryAddress,
      selectedDeliveryAddress,
      updateQuantity
    ]
  )

  return <B2BCheckoutContext.Provider value={value}>{children}</B2BCheckoutContext.Provider>
}

export function useB2BCheckout() {
  const context = useContext(B2BCheckoutContext)
  if (!context) {
    throw new Error('useB2BCheckout must be used within B2BCheckoutProvider')
  }
  return context
}
