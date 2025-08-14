// src/features/orders-table/components/OrdersTable.tsx
import { useOrders } from '../hooks/useOrders'
import OrdersToolbar from './OrdersToolbar'

type Order = {
  id: string | number
  customer: string
  status: string
  total: number
  createdAt: string | number | Date
}

export default function OrdersTable() {
  
  const { data, isLoading, isError } = useOrders() as {
    data: Order[]
    isLoading: boolean
    isError: boolean
  }

  if (isLoading) return <p>Loading orders…</p>
  if (isError) return <p>Failed to load orders.</p>

  return (
    <div>
      <h2>Orders</h2>
      <OrdersToolbar />
      <table width="100%" cellPadding={8} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">ID</th>
            <th align="left">Customer</th>
            <th align="left">Status</th>
            <th align="right">Total</th>
            <th align="left">Created</th>
          </tr>
        </thead>
        <tbody>
          {data.map((o) => (
            <tr key={o.id} style={{ borderTop: '1px solid #ddd' }}>
              <td>{o.id}</td>
              <td>{o.customer}</td>
              <td>{o.status}</td>
              <td align="right">${o.total.toFixed(2)}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: 8 }}>
        Showing <strong>{data.length}</strong> orders
      </p>
    </div>
  )
}
