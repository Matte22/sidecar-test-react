import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './styles.css'
import App from "./App"
import { bootstrap } from "./auth/bootstrap"
import { installGlobalOAuthEnv } from './env'
const qc = new QueryClient()

async function start() {
  // Ensure STIGMAN.Env.oauth is populated from Vite env or defaults
  installGlobalOAuthEnv()
  const bootResult = await bootstrap()
  if (!bootResult.success) console.error("Failed to initialize.", bootResult.error)

  // If you want the worker anywhere, you can inject via context or props
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={qc}>
          {/* <RouterProvider router={router} /> */}
        <App oidcWorker={bootResult.oidcWorker} />
        </QueryClientProvider>
    </React.StrictMode>
  )
}

start()
