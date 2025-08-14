// src/features/orders-table/mocks/orders.handlers.ts
import { http, HttpResponse } from 'msw'
import type { Order } from '../api/orders.api'

const seed: Order[] = [
  { id: '1001', customer: 'Alice', status: 'NEW', total: 42.5, createdAt: new Date().toISOString() },
  { id: '1002', customer: 'Bob', status: 'SHIPPED', total: 120.0, createdAt: new Date(Date.now()-86400000).toISOString() },
  { id: '1003', customer: 'Chandra', status: 'CANCELLED', total: 15, createdAt: new Date(Date.now()-2*86400000).toISOString() },
  { id: '1004', customer: 'Diego', status: 'NEW', total: 75, createdAt: new Date().toISOString() },
]

export const ordersHandlers = [
  http.get('*/orders', () => HttpResponse.json(seed)),
]
