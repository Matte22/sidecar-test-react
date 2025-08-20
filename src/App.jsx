import React, { useEffect, useState } from "react"
import TokenCard from './auth/TokenCard'
import { ReauthPrompt } from "./auth/ReauthPrompt"
import { NavTree } from '@/features/NavTree'
import { AssetsGrid } from '@/features/AssetGrid'

export default function App({ oidcWorker }) {
  const [selectedData, onSelectedDataChange] = useState(null)

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand">
            <img src="/shield-green-check.svg" alt="Logo" className="brand-logo" />
            <h1 className="brand-title">Dumb App</h1>
          </div>
          <div className="header-actions">
            <TokenCard oidcWorker={oidcWorker} />
            <ReauthPrompt oidcWorker={oidcWorker} />
          </div>
        </div>
      </header>

      <div className="app-main">
        <aside className="app-sidebar">
          <div className="sidebar-header">
            <h2>Collections</h2>
          </div>
          <div className="sidebar-body">
            <NavTree onSelectedDataChange={onSelectedDataChange}/>
          </div>
        </aside>

        <main className="app-content">
          <div className="content-inner">
            <AssetsGrid selectedData={selectedData}/>
          </div>
        </main>
      </div>
    </div>
  )
}
