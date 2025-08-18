import { useQuery } from '@tanstack/react-query'
import { assetsApi } from '../api/assets.api'

export const useAssets = (collectionId: string | null) => {
  return useQuery({
    queryKey: ['assets', collectionId],
    queryFn: () => assetsApi.getByCollectionId(collectionId!),
    enabled: !!collectionId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}