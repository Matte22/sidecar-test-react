
import React, {useState, useEffect} from "react"
import type { OidcWorkerClient } from "./setupOidcWorker"
import { useAuthStore } from "../state/authStore"
type Props = {
  oidcWorker?: OidcWorkerClient
}

function maskToken(tok: string, head = 18, tail = 12) {
  if (!tok) return ""
  if (tok.length <= head + tail) return tok
  return tok.slice(0, head) + "…" + tok.slice(-tail)
}

function decodeJwt(token: string | null) {
  if (!token) return null
  const parts = token.split(".")
  if (parts.length !== 3) return null
  try {
    const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(json)
  } catch {
    return null
  }
}

function formatExp(exp?: number) {
  if (!exp) return { abs: "—", rel: "" }
  const date = new Date(exp * 1000)
  const now = Date.now()
  const diffMs = date.getTime() - now
  const mins = Math.round(diffMs / 60000)
  const rel = mins >= 0 ? `${mins} min left` : `${Math.abs(mins)} min ago`
  return { abs: date.toLocaleString(), rel }
}

export default function TokenCard({ oidcWorker }: Props) {
  const noTokenMessage = useAuthStore((s) => s.noTokenMessage)
  const [token, setToken] = useState<string | null>(oidcWorker?.token ?? null)
  const [payload, setPayload] = useState<any>(oidcWorker?.tokenParsed ?? null)
  const [showFull, setShowFull] = useState(false)
  const [copyOk, setCopyOk] = useState<null | "ok" | "err" >(null)

  useEffect(() => {
    if (!oidcWorker) return
    // Seed with any existing token
    setToken(oidcWorker.token)
    setPayload(oidcWorker.tokenParsed)

    const handler = (event: MessageEvent) => {
      const data: any = (event as any).data
      if (data?.type === "accessToken") {
        setToken(data.accessToken)
        setPayload(data.accessTokenPayload)
      } else if (data?.type === "noToken") {
        setToken(null)
        setPayload(null)
      }
    }

    oidcWorker.bc.addEventListener("message", handler)
    return () => oidcWorker.bc.removeEventListener("message", handler)
  }, [oidcWorker])

  const effectivePayload = payload || decodeJwt(token)
  const { abs: expAbs, rel: expRel } = formatExp(effectivePayload?.exp)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(token || "")
      setCopyOk("ok")
      setTimeout(() => setCopyOk(null), 1200)
    } catch {
      setCopyOk("err")
      setTimeout(() => setCopyOk(null), 1200)
    }
  }
  const onLogout = async () => {
    await oidcWorker?.logout()
  }

  const status = token ? "Authenticated" : "No token"

  return (
    <div className="max-w-3xl mx-auto my-6 p-5 rounded-2xl shadow border bg-white/5 text-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Access Token</h2>
          <p className="opacity-80">Status: {status}{expAbs !== "—" && token ? ` — expires ${expRel} (${expAbs})` : ""}</p>
        </div>
        <div className="flex gap-2">
          {token && (
            <>
              <button className="px-3 py-1 rounded-xl border shadow-sm" onClick={() => setShowFull((s) => !s)}>
                {showFull ? "Hide" : "Reveal"}
              </button>
              <button className="px-3 py-1 rounded-xl border shadow-sm" onClick={onCopy} disabled={!token}>
                {copyOk === "ok" ? "Copied" : copyOk === "err" ? "Error" : "Copy"}
              </button>
              <button className="px-3 py-1 rounded-xl border shadow-sm" onClick={onLogout}>Logout</button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4">
        {token ? (
          <>
            <div className="font-mono break-all p-3 rounded-xl bg-black/20">
              {showFull ? token : maskToken(token)}
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer select-none">Decoded Payload (claims)</summary>
              <pre className="mt-2 p-3 rounded-xl bg-black/10 overflow-auto max-h-80 text-xs">
                {JSON.stringify(effectivePayload || {}, null, 2)}
              </pre>
            </details>
          </>
        ) : (
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <p className="mb-1">No access token available.</p>
            {noTokenMessage ? (
              <pre className="text-xs opacity-80 whitespace-pre-wrap">
                {JSON.stringify(noTokenMessage, null, 2)}
              </pre>
            ) : (
              <p className="opacity-80">Use the button above to sign in.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}