import { api } from '@/api/client'
import type { Collection } from '@/state/collectionStore'

export const collectionsApi = {
  getAll: async (): Promise<Collection[]> => {
    const response = await api.get<Collection[]>('/collections')
    console.log('📋 Raw collections response:', response.data)
    return response.data
  }
}