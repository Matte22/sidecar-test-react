import type { OAuthEnv } from '../env'

declare global {
  interface Window {
    STIGMAN?: {
      Env?: {
        oauth?: OAuthEnv
      }
    }
  }
}

export {}
