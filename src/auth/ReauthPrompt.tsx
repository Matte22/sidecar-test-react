// @ts-nocheck
import React, { useEffect, useRef } from 'react'
import type { OidcWorkerClient } from './setupOidcWorker'
import { useAuthStore } from '../state/authStore'

type Props = { oidcWorker?: OidcWorkerClient }

export function ReauthPrompt({ oidcWorker }: Props) {
  const noTokenMessage = useAuthStore((s) => s.noTokenMessage)
  const clear = useAuthStore((s) => s.clearNoTokenMessage)
  const popupRef = useRef<Window | null>(null)
  
  const onSignIn = async () => {
    if (!oidcWorker) return

    const width = 600
    const height = 740
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    localStorage.setItem('reauth-codeVerifier', noTokenMessage.codeVerifier)
    localStorage.setItem('reauth-oidcState', noTokenMessage.state)
    console.log('Opening reauth popup', noTokenMessage.redirect, 'at', `width=${width},height=${height},left=${left},top=${top}`)
  }

  if (!noTokenMessage) return null

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow">
        <h3 className="text-lg font-semibold">Sign in required</h3>
        <p className="mt-1 text-sm opacity-80">
          
        </p>{noTokenMessage?.reason === 'expiringSoon'
            ? 'Your session is about to expire.'
            : 'Your session ended or is invalid.'}
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-1 rounded-xl border shadow" onClick={onSignIn}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}


