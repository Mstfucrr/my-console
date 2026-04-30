'use client'

import { getOrDefault, setItem } from '@/lib/local-storage-helper'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SUPPLY_CART_STORAGE_KEY } from '../constants'
import type { SupplyCartItem, SupplyProduct } from '../types'

export function useSupplyCart() {
  const [cart, setCart] = useState<SupplyCartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setCart(getOrDefault<SupplyCartItem[]>(SUPPLY_CART_STORAGE_KEY, []))
      setHydrated(true)
    })
  }, [])

  useEffect(() => {
    if (!hydrated) return
    setItem(SUPPLY_CART_STORAGE_KEY, cart)
  }, [cart, hydrated])

  const addToCart = useCallback((product: SupplyProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId))
      return
    }
    setCart(prev => prev.map(item => (item.product.id === productId ? { ...item, quantity } : item)))
  }, [])

  const getCartQuantity = useCallback(
    (productId: string) => cart.find(item => item.product.id === productId)?.quantity ?? 0,
    [cart]
  )

  const cartItemCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  return {
    cart,
    addToCart,
    updateQuantity,
    getCartQuantity,
    cartItemCount,
    clearCart
  }
}
