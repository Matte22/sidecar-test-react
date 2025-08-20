// @ts-nocheck
import React, { useRef } from 'react'
import type { OidcWorkerClient } from './setupOidcWorker'
import { useAuthStore } from '../state/authStore'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'

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
    window.open(noTokenMessage.redirect, 'reauthPopup', `width=${width},height=${height},left=${left},top=${top}`)
  }


  if (!noTokenMessage) return null

  return (
    <Dialog
      visible={!!noTokenMessage}
      modal
      header="Sign in required"
      closable={false}     
      blockScroll
      draggable={false}
      resizable={false}
      style={{ width: '15rem', maxWidth: '95vw', colorScheme: 'light', backgroundColor: 'white' }}
      contentClassName="p-4"
    >
    <div className="mt-4 flex justify-end gap-2">
      <Button label="Sign in" onClick={onSignIn} />
    </div>
    </Dialog>
  )
}
