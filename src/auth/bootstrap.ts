
import { setupOidcWorker, type OidcWorkerClient } from "./setupOidcWorker"
import { useAuthStore } from "../state/authStore"

export type BootResult = {
  success: boolean
  error: any
  oidcWorker?: OidcWorkerClient
}

export async function bootstrap(): Promise<BootResult> {
  const result: BootResult = { success: false, error: null }

  const OW = setupOidcWorker()
  result.oidcWorker = OW

  OW.bc.addEventListener("message", (event: MessageEvent) => {
    const data: any = (event as any).data
    if (data?.type === "noToken") {
      useAuthStore.getState().setNoTokenMessage(data)
      useAuthStore.getState().setAccessToken(null)
    } else if (data?.type === "accessToken") {
      useAuthStore.getState().clearNoTokenMessage()
      useAuthStore.getState().setAccessToken(data.accessToken)
    }
  })

  const url = new URL(window.location.href)
  const redirectUri = `${url.origin}${url.pathname}`
  const env =(window as any).STIGMAN?.Env?.oauth ?? (globalThis as any).STIGMAN?.Env?.oauth
  console.log("OIDC Bootstrap with redirectUri:", redirectUri, "and env:", env)
  const response = await OW.sendWorkerRequest({
    request: "initialize",
    redirectUri,
    env
  })

  if (response?.error) {
    result.error = response.error
    return result
  }

  const paramStr = extractParamString(url)
  if (paramStr) {
    await handleRedirectAndParameters(OW, redirectUri, paramStr)
  } else {
    await handleNoParameters(OW)
  }

  result.success = true
  return result
}

function extractParamString(url: URL): string {
  if (url.hash) return url.hash.substring(1) // remove leading '#'
  if (url.search) return url.search.substring(1) // remove leading '?'
  return ""
}

function processRedirectParams(paramStr: string): Record<string, string> {
  const params: Record<string, string> = {}
  const usp = new URLSearchParams(paramStr)
  for (const [key, value] of usp) params[key] = value
  return params
}

async function handleNoParameters(OW: OidcWorkerClient) {
  const response = await OW.sendWorkerRequest({ request: "getAccessToken" })
  if (response?.accessToken) {
    OW.token = response.accessToken
    OW.tokenParsed = response.accessTokenPayload
    useAuthStore.getState().setAccessToken(response.accessToken)
    return true
  } else if (response?.redirect) {
    localStorage.setItem("reauth-codeVerifier", response.codeVerifier)
    localStorage.setItem("reauth-oidcState", response.state)
    window.location.href = response.redirect
  }
}

async function handleRedirectAndParameters(
  OW: OidcWorkerClient,
  redirectUri: string,
  paramStr: string
) {
  const params = processRedirectParams(paramStr)
  if (!params.code) {
    // Keep identical behavior for easier diffing/logging
    let errorMessage = "No authorization code provided in the URL parameters."
    if (params.error) {
      errorMessage += ` Error: ${params.error}`
      if (params.error_description) errorMessage += ` - ${params.error_description}`
    }
    console.log(errorMessage)
    return
  }

  if (!params.state || params.state !== localStorage.getItem("reauth-oidcState")) {
    console.log("State mismatch. The state parameter does not match the expected value.")
    return
  }

  const response = await OW.sendWorkerRequest({
    request: "exchangeCodeForToken",
    code: params.code,
    codeVerifier: localStorage.getItem("reauth-codeVerifier"),
    clientId: (window as any).STIGMAN?.Env?.oauth?.clientId ?? (globalThis as any).STIGMAN?.Env?.oauth?.clientId,
    redirectUri,
  })

  if (response?.success) {
    OW.token = response.accessToken
    OW.tokenParsed = response.accessTokenPayload
    useAuthStore.getState().setAccessToken(response.accessToken)
    window.history.replaceState(window.history.state, "", redirectUri)
    localStorage.removeItem("reauth-codeVerifier")
    localStorage.removeItem("reauth-oidcState")
    return true
  } else {
    console.log(response?.error || "Failed to exchange code for token")
  }
}
