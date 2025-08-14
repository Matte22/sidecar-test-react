// src/features/orders-table/api/orders.api.ts
import { api } from '@/lib/axios'

export type Order = {
  id: string
  customer: string
  status: 'NEW' | 'SHIPPED' | 'CANCELLED'
  total: number
  createdAt: string
}

export async function getOrders(): Promise<Order[]> {
  const res = await api.get('/orders')
  return res.data
}
