import React, { useEffect } from "react"
import TokenCard from './auth/TokenCard'
import type { OidcWorkerClient } from "./auth/setupOidcWorker"
import { ReauthPrompt } from "./auth/ReauthPrompt"
import { CollectionsList } from '@/features/collections-list'
import { AssetsGrid } from '@/features/assets-grid'
import { useAuthStore } from '@/state/authStore'

export default function App({ oidcWorker }: { oidcWorker?: OidcWorkerClient }) {
  const { accessToken } = useAuthStore()

  useEffect(() => {
    console.log('Auth state:', {
      hasToken: !!accessToken,
      tokenLength: accessToken?.length || 0,
      oidcWorkerToken: oidcWorker?.token ? 'present' : 'missing'
    })
  }, [accessToken, oidcWorker?.token])

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Auth components at top */}
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex-shrink-0">
        <TokenCard oidcWorker={oidcWorker} />
        <ReauthPrompt oidcWorker={oidcWorker} />
        
        <div className="mt-2 text-xs text-gray-500">
          Token: {accessToken ? '✅ Present' : '❌ Missing'} | 
          OIDC: {oidcWorker?.token ? '✅ Present' : '❌ Missing'}
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <CollectionsList />
        <AssetsGrid />
      </div>
    </div>
  )
}
