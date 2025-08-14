// src/features/orders-table/state/orders.store.ts
import { create } from 'zustand'

type OrdersFilter = {
  status: 'ALL' | 'NEW' | 'SHIPPED' | 'CANCELLED'
  minTotal?: number
}

type OrdersState = {
  filter: OrdersFilter
  setStatus: (s: OrdersFilter['status']) => void
  setMinTotal: (v?: number) => void
  reset: () => void
}

export const useOrdersStore = create<OrdersState>((set) => ({
  filter: { status: 'ALL', minTotal: undefined },
  setStatus: (status) => set((s) => ({ filter: { ...s.filter, status } })),
  setMinTotal: (minTotal) => set((s) => ({ filter: { ...s.filter, minTotal } })),
  reset: () => set({ filter: { status: 'ALL', minTotal: undefined } }),
}))
