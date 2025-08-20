import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/state/authStore'

export function useAssetGrid({ selectedCollection, apiBase = 'http://localhost:64001' }) {
  
  const { accessToken } = useAuthStore()
  const [selectedAsset, setSelectedAsset] = useState(null)
  const metaKey = true

  const collectionId = useMemo(() => {
    if (!selectedCollection) return null
    // Check if value itself is the collectionId
    if (typeof selectedCollection === 'string') {
      return selectedCollection
    }
    // Otherwise try to get collectionId from the object
    return selectedCollection
  }, [selectedCollection])

  function getContrastYIQ(hexcolor) {
    const r = parseInt(hexcolor.substr(0, 2), 16)
    const g = parseInt(hexcolor.substr(2, 2), 16)
    const b = parseInt(hexcolor.substr(4, 2), 16)
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
    return (yiq >= 128) ? '#080808' : '#f7f7f7'
  }

  const labelsQuery = useQuery({
    queryKey: ['collections', collectionId, 'labels', accessToken],
    enabled: !!collectionId && typeof collectionId === 'string' && !!accessToken,
    queryFn: async () => {
      const res = await fetch(`${apiBase}/api/collections/${collectionId}/labels`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (!res.ok) throw new Error(`Labels ${res.status} ${res.statusText}`)
      const labelsApi = await res.json()
      const map = new Map()
      for (const label of labelsApi) {
        const bg = `#${label.color}`
        const fg = getContrastYIQ(label.color)
        map.set(label.labelId, {
          id: label.labelId,
          name: label.name,
          bgColor: bg,
          textColor: fg,
        })
      }
      return map
    },
  })

  const assetsQuery = useQuery({
    queryKey: ['collections', collectionId, 'assets', 'stigs', accessToken],
    enabled: !!collectionId && typeof collectionId === 'string' && !!accessToken,
    queryFn: async () => {
      const res = await fetch(
        `${apiBase}/api/assets?collectionId=${collectionId}&projection=stigs`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (!res.ok) throw new Error(`Assets ${res.status} ${res.statusText}`)
      return res.json()
    },
    placeholderData: (prev) => prev,
  })

  const items = useMemo(() => 
    assetsQuery.data ?? [], 
    [assetsQuery.data]
  )

  const labels = useMemo(() => 
    labelsQuery.data ?? null, 
    [labelsQuery.data]
  )

  const loading = useMemo(() => 
    labelsQuery.isFetching || assetsQuery.isFetching,
    [labelsQuery.isFetching, assetsQuery.isFetching]
  )

  const error = useMemo(() => 
    labelsQuery.error?.message || assetsQuery.error?.message || null,
    [labelsQuery.error, assetsQuery.error]
  )

  return {
    items,
    labels,
    loading,
    error,
    selectedAsset,
    metaKey,
    onSelectionChange: (e) => setSelectedAsset(e.value)
  }
}