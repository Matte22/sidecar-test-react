import { useQuery } from '@tanstack/react-query'
import { collectionsApi } from '../api/collections.api'

export const useCollections = () => {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      console.log('🔄 Fetching collections...')
      try {
        const result = await collectionsApi.getAll()
        console.log('✅ Collections fetched successfully:', result)
        return result
      } catch (error) {
        console.error('❌ Error fetching collections:', error)
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}