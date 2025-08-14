import { http, HttpResponse } from 'msw'
import { ordersHandlers } from '@/features/orders-table/mocks/orders.handlers'
export const handlers = [
  ...ordersHandlers
]


