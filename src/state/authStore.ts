

// import { create } from "zustand"

// export type NoTokenMessage = {
//   type: "noToken"
//   reason?: string
//   [k: string]: any
// } | null

// export type AuthState = {
//   noTokenMessage: NoTokenMessage
//   setNoTokenMessage: (msg: NoTokenMessage) => void
//   clearNoTokenMessage: () => void
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   noTokenMessage: null,
//   setNoTokenMessage: (msg) => set({ noTokenMessage: msg }),
//   clearNoTokenMessage: () => set({ noTokenMessage: null }),
// }))

import { create } from "zustand"

export type NoTokenMessage = {
  type: "noToken"
  reason?: string
  [k: string]: any
} | null

export type ReauthPlan = { redirect: string; codeVerifier: string; state: string } | null

export type AuthState = {
  noTokenMessage: NoTokenMessage
  setNoTokenMessage: (msg: NoTokenMessage) => void
  clearNoTokenMessage: () => void

  reauthPlan: ReauthPlan
  setReauthPlan: (plan: ReauthPlan) => void
  clearReauthPlan: () => void

  accessToken: string | null
  setAccessToken: (token: string | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  noTokenMessage: null,
  setNoTokenMessage: (msg) => set({ noTokenMessage: msg }),
  clearNoTokenMessage: () => set({ noTokenMessage: null }),

  reauthPlan: null,
  setReauthPlan: (plan) => set({ reauthPlan: plan }),
  clearReauthPlan: () => set({ reauthPlan: null }),

  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
}))
