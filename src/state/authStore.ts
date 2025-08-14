import { create } from 'zustand'

// add these optional fields so TS is happy
export type NoTokenMessage = {
  type: 'noToken'
  reason?: string
  redirect?: string
  codeVerifier?: string
  state?: string
  [k: string]: unknown
}


type AuthState = {
  noTokenMessage: NoTokenMessage | null
  setNoTokenMessage: (msg: NoTokenMessage | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  noTokenMessage: null,
  setNoTokenMessage: (msg) => set({ noTokenMessage: msg }),
}))
