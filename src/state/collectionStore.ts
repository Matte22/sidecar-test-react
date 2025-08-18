import { create } from 'zustand'

export type Collection = {
  collectionId: string
  description?: string
  metadata?: Record<string, string>
  name: string
  owners?: Array<{
    userId?: string
    username?: string
    displayName?: string
    userGroupId?: string
    name?: string
    description?: string
  }>
  settings?: {
    fields?: {
      comment?: {
        enabled?: string
        required?: string
      }
      detail?: {
        enabled?: string
        required?: string
      }
    }
    history?: {
      maxReviews?: number
    }
    status?: {
      canAccept?: boolean
      minAcceptGrant?: number
      resetCriteria?: string
    }
    importOptions?: {
      autoStatus?: {
        fail?: string | null
        notapplicable?: string | null
        pass?: string | null
      }
      unreviewed?: string
      unreviewedCommented?: string
      emptyDetail?: string
      emptyComment?: string
      allowCustom?: boolean
    }
  }
  statistics?: {
    assetCount?: number
    checklistCount?: number
    created?: string
    userCount?: number
  }
}

type CollectionState = {
  selectedCollectionId: string | null
  setSelectedCollectionId: (id: string | null) => void
}

export const useCollectionStore = create<CollectionState>((set) => ({
  selectedCollectionId: null,
  setSelectedCollectionId: (id) => set({ selectedCollectionId: id }),
}))