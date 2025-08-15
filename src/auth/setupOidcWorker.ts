
export type OidcWorkerClient = {
  worker: SharedWorker
  bc: BroadcastChannel
  token: string | null
  tokenParsed: any | null
  sendWorkerRequest: (request: Record<string, any>) => Promise<any>
  postContextActiveMessage: () => void
  logout: () => Promise<void>
}

export function setupOidcWorker(): OidcWorkerClient {
  const worker: SharedWorker = new SharedWorker("/oidc-worker.js", { name: "oidc-worker", type: "module" })

  const OW: OidcWorkerClient = {
    worker,
    bc: new BroadcastChannel("stigman-oidc-worker"),
    token: null,
    tokenParsed: null,
    sendWorkerRequest(request) {
      const requestId = crypto.randomUUID()
      const port = (this.worker as any).port as MessagePort
      port.postMessage({ ...request, requestId })
      return new Promise((resolve) => {
        function handler(event: MessageEvent) {
          if ((event.data as any)?.requestId === requestId) {
            port.removeEventListener("message", handler as any)
            resolve((event.data as any).response)
          }
        }
        port.addEventListener("message", handler as any)
      })
    },
    postContextActiveMessage() {
      ;((this.worker as any).port as MessagePort).postMessage({ requestId: "contextActive" })
    },
    async logout() {
      const response = await this.sendWorkerRequest({ request: "logout" })
      if (response?.success) {
        this.token = null
        this.tokenParsed = null
        if (response.redirect) window.location.href = response.redirect
      }
    },
  }

  ;((OW.worker as any).port as MessagePort).start()

  OW.bc.onmessage = (event: MessageEvent) => {
    const data: any = (event as any).data
    if (data?.type === "accessToken") {
      OW.token = data.accessToken
      OW.tokenParsed = data.accessTokenPayload
    } else if (data?.type === "noToken") {
      OW.token = null
      OW.tokenParsed = null
    }
  }

  return OW
}
