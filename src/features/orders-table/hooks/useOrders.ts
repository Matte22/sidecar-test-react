// src/features/orders-table/hooks/useOrders.ts
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getOrders, Order } from '../api/orders.api'
import { useOrdersStore } from '../state/orders.store'

export function useOrders() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    staleTime: 30_000,
  })

  const { status, minTotal } = useOrdersStore((s) => s.filter)

  // Basic business logic: filter by status and minimum total
  const filtered = useMemo(() => {
    if (!data) return [] as Order[]
    return data.filter((o) => {
      const statusOk = status === 'ALL' ? true : o.status === status
      const minOk = typeof minTotal === 'number' ? o.total >= minTotal : true
      return statusOk && minOk
    })
  }, [data, status, minTotal])

  return { data: filtered, isLoading, isError }
}
