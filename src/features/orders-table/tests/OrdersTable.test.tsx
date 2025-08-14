import { render, screen } from '@testing-library/react'
import OrdersTable from '../components/OrdersTable'
import { Providers } from '@/test-utils'
import { server } from '@/mocks/server'
import { ordersHandlers } from '../mocks/orders.handlers'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders orders from API', async () => {
  server.use(...ordersHandlers)

  render(
    <Providers>
      <OrdersTable />
    </Providers>
  )

  // loading state
  expect(screen.getByText(/Loading orders/i)).toBeInTheDocument()

  // table should render after data arrives
  expect(await screen.findByRole('heading', { name: /Orders/i })).toBeInTheDocument()
  expect(await screen.findByText(/Alice/)).toBeInTheDocument()
})
