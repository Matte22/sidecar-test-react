// @ts-nocheck
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { RouterProvider } from 'react-router-dom'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { router } from './router'
// import './styles.css'

// const qc = new QueryClient()

// async function enableMocks() {
//   if (import.meta.env.DEV) {
//     const { worker } = await import('./mocks/browser')
//     await worker.start({ onUnhandledRequest: 'bypass' })
//   }
// }

// enableMocks().then(() => {
//   ReactDOM.createRoot(document.getElementById('root')!).render(
//     <React.StrictMode>
//       <QueryClientProvider client={qc}>
//         <RouterProvider router={router} />
//       </QueryClientProvider>
//     </React.StrictMode>
//   )
// })

import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { bootstrap } from "./auth/bootstrap"
import { installGlobalOAuthEnv } from './env'
// async function start() {

//   installGlobalOAuthEnv()

//   const bootResult = await bootstrap()
//   // src/main.tsx
// // auto-close if we’re the popup that just completed login
// if (bootResult.oidcWorker) {
//   bootResult.oidcWorker.bc.addEventListener('message', (ev: MessageEvent) => {
//     const data: any = ev.data
//     if (data?.type === 'accessToken' && window.opener && !window.opener.closed) {
//       setTimeout(() => window.close(), 50)
//     }
//   })
// }

//   console.log("Boot result:", bootResult)
//   if (!bootResult.success) console.error("Failed to initialize.", bootResult.error)

//   // If you want the worker anywhere, you can inject via context or props
//   ReactDOM.createRoot(document.getElementById("root")!).render(
//     <React.StrictMode>
//       <App oidcWorker={bootResult.oidcWorker} />
//     </React.StrictMode>
//   )
// }

// start()
async function start() {
  // Ensure STIGMAN.Env.oauth is populated from Vite env or defaults
  installGlobalOAuthEnv()
  const bootResult = await bootstrap()
  if (!bootResult.success) console.error("Failed to initialize.", bootResult.error)

  // If you want the worker anywhere, you can inject via context or props
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App oidcWorker={bootResult.oidcWorker} />
    </React.StrictMode>
  )

  // If this window is the popup (it has an opener), close it as soon as the worker
  // broadcasts a new access token. Also clear any noToken message in this window.
  // if (bootResult.oidcWorker) {
  //   const ow = bootResult.oidcWorker
  //   const onMsg = (event: MessageEvent) => {
  //     const data: any = (event as any).data
  //     if (data?.type === "accessToken") {
  //       try { useAuthStore.getState().clearNoTokenMessage() } catch {}
  //       if (window.opener && !window.opener.closed) {
  //         try { window.opener.focus?.() } catch {}
  //         setTimeout(() => window.close(), 50)
  //       }
  //     }
  //   }
  //   ow.bc.addEventListener("message", onMsg)
  //}
}

start()
