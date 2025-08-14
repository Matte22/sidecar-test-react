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

// @ts-nocheck
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
