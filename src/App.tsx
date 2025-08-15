import React from "react"
import TokenCard from './auth/TokenCard'
import type { OidcWorkerClient } from "./auth/setupOidcWorker"
import { ReauthPrompt } from "./auth/ReauthPrompt"

export default function App({ oidcWorker }: { oidcWorker?: OidcWorkerClient }) {
  return (
    <div className="p-6">
      <TokenCard oidcWorker={oidcWorker} />
       <ReauthPrompt oidcWorker={oidcWorker} />
    </div>
  )
}
