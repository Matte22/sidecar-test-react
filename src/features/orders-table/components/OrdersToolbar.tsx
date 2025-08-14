// src/features/orders-table/components/OrdersToolbar.tsx
import { useOrdersStore } from '../state/orders.store'

export default function OrdersToolbar() {
  const status = useOrdersStore((s) => s.filter.status)
  const minTotal = useOrdersStore((s) => s.filter.minTotal)
  const setStatus = useOrdersStore((s) => s.setStatus)
  const setMinTotal = useOrdersStore((s) => s.setMinTotal)
  const reset = useOrdersStore((s) => s.reset)

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
      <label>
        Status:{' '}
        <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="ALL">All</option>
          <option value="NEW">New</option>
          <option value="SHIPPED">Shipped</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </label>

      <label>
        Min Total:{' '}
        <input
          type="number"
          placeholder="e.g. 50"
          value={minTotal ?? ''}
          onChange={(e) =>
            setMinTotal(e.target.value === '' ? undefined : Number(e.target.value))
          }
          style={{ width: 100 }}
        />
      </label>

      <button onClick={reset}>Reset</button>
    </div>
  )
}
