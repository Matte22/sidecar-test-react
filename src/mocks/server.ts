import { setupServer } from 'msw/node'
import { handlers } from './handlers' // your aggregated feature handlers
export const server = setupServer(...handlers)
