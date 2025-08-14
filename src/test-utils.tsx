
import { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function Providers({ children }: PropsWithChildren) {
  const qc = new QueryClient()
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}
