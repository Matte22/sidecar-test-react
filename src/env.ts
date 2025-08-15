
export type OAuthEnvClaims = {
  scope: string
  username: string
  privileges: string
  name?: string
  privilegesChain?: string
  email?: string
  assertion?: string
}

export type OAuthEnv = {
  authority: string
  clientId: string
  responseMode: 'query' | 'fragment'
  scopePrefix?: string
  extraScopes?: string
  strictPkce?: boolean
  claims: OAuthEnvClaims
  idleTimeoutAdmin?: number
  idleTimeoutUser?: number
  audienceValue?: string
}

export const OAUTH_ENV: OAuthEnv = {
  authority: import.meta.env.VITE_OAUTH_AUTHORITY || 'http://localhost:8080/realms/stigman',
  clientId: import.meta.env.VITE_OAUTH_CLIENT_ID || 'stig-manager',
  responseMode: (import.meta.env.VITE_OAUTH_RESPONSE_MODE as 'query'|'fragment') || 'fragment',

  scopePrefix: import.meta.env.VITE_OAUTH_SCOPE_PREFIX || '',
  extraScopes: import.meta.env.VITE_OAUTH_EXTRA_SCOPES || '',

  strictPkce: String(import.meta.env.VITE_OAUTH_STRICT_PKCE ?? 'true') === 'true',

  claims: {
    scope: import.meta.env.VITE_OAUTH_CLAIM_SCOPE || 'scope',
    username: import.meta.env.VITE_OAUTH_CLAIM_USERNAME || 'preferred_username',
    privileges: import.meta.env.VITE_OAUTH_CLAIM_PRIVILEGES || 'realm_access.roles',
    name: import.meta.env.VITE_OAUTH_CLAIM_NAME || 'name',
    privilegesChain: import.meta.env.VITE_OAUTH_CLAIM_PRIVILEGES_CHAIN || 'realm_access.roles',
    email: import.meta.env.VITE_OAUTH_CLAIM_EMAIL || 'email',
    assertion: import.meta.env.VITE_OAUTH_CLAIM_ASSERTION || 'jti',
  },

  idleTimeoutAdmin: Number(import.meta.env.VITE_IDLE_TIMEOUT_ADMIN ?? 30),
  idleTimeoutUser: Number(import.meta.env.VITE_IDLE_TIMEOUT_USER ?? 15),

  audienceValue: import.meta.env.VITE_OAUTH_AUDIENCE || undefined,
}

// Put it on window so bootstrap() can read it without changing your flow
export function installGlobalOAuthEnv(env: OAuthEnv = OAUTH_ENV) {
  ;(window as any).STIGMAN ??= {}
  ;(window as any).STIGMAN.Env ??= {}
  ;(window as any).STIGMAN.Env.oauth = env
}