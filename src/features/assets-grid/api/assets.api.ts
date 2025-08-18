import { api } from '@/api/client'

export type Asset = {
  assetId: string
  name: string
  description?: string
  ip?: string
  fqdn?: string
  mac?: string
  noncomputing?: boolean
  metadata?: Record<string, any>
  labelIds?: string[]
  stigs?: {
    benchmark: string
    lastRevisionStr: string
    revisionStr: string
    ruleCount: number
    title: string
  }[]
  metrics?: {
    assessments?: number
    assessed?: number
    statuses?: {
      [key: string]: number
    }
  }
}

export const assetsApi = {
  getByCollectionId: async (collectionId: string): Promise<Asset[]> => {
    const response = await api.get<Asset[]>(`/collections/${collectionId}/metrics/summary/asset`)
    return response.data
  }
}