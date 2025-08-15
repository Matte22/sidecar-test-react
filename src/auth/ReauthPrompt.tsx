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

    const w = window.open('', 'ReauthPopup', `width=${width},height=${height},left=${left},top=${top}`)
    if (!w) {
      // Fallback: full-tab redirect
      const r = await oidcWorker.sendWorkerRequest({ request: 'getAccessToken' })
      if (r?.redirect) {
        localStorage.setItem('reauth-codeVerifier', r.codeVerifier)
        localStorage.setItem('reauth-oidcState', r.state)
        window.location.href = r.redirect
      }
      return
    }
    popupRef.current = w
    w.document.write('<!doctype html><title>Sign in</title><p>Loading…</p>')

    const popupCallback = new URL('/reauth.html', window.location.origin).toString()
    const r = await oidcWorker.sendWorkerRequest({
      request: 'getAccessToken',
      redirectUri: popupCallback,    
    })

    if (!r?.redirect) {
      w.document.body.textContent = 'Could not start sign-in.'
      return
    }

    try {
   w.localStorage.setItem('reauth-codeVerifier', r.codeVerifier)
    w.localStorage.setItem('reauth-oidcState', r.state)

    } catch {}

    w.location.replace(r.redirect)
  }
    
    useEffect(() => {
      const handler = (event: MessageEvent) => {
        console.log('[opener] message:', event.origin, event.data);
        if (event.origin !== window.location.origin) return;
        if (event.data === 'reauthComplete') {
          clear();
          popupRef.current?.close();
          popupRef.current = null;
        }
      };
      window.addEventListener('message', handler);
      return () => window.removeEventListener('message', handler);
    }, [clear]);


  if (!noTokenMessage) return null

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow">
        <h3 className="text-lg font-semibold">Sign in required</h3>
        <p className="mt-1 text-sm opacity-80">
          {noTokenMessage?.reason === 'expiringSoon'
            ? 'Your session is about to expire.'
            : 'Your session ended or is invalid.'}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-1 rounded-xl border shadow" onClick={onSignIn}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}
