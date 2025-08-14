import { render, screen } from '@testing-library/react'
import Home from './Home'
import { Providers } from '@/test-utils'
import { server } from '@/mocks/server'
import { ordersHandlers } from '@/features/orders-table/mocks/orders.handlers'

// make sure MSW returns data for /orders
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders OrdersTable inside Home', async () => {
  // add the orders handlers for this test
  server.use(...ordersHandlers)

  render(
    <Providers>
      <Home />
    </Providers>
  )

  expect(await screen.findByRole('heading', { name: /Orders/i })).toBeInTheDocument()
  expect(await screen.findByText(/Showing/i)).toBeInTheDocument()
})
