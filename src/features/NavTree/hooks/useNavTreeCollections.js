import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from '@/state/authStore'

export function useNavTreeCollections() {

  const { accessToken } = useAuthStore()


  const collectionsQuery = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const res = await fetch("http://localhost:64001/api/collections", {
        headers: { Authorization: `Bearer ${accessToken ?? ""}` },
      })
      if (!res.ok) throw new Error(`Collections ${res.status} ${res.statusText}`)
      return res.json()
    },
    enabled: !!accessToken, 
  })

  const nodes = useMemo(() => {
    const collections = collectionsQuery.data ?? []
    return [
      {
        key: "collections",
        label: "Collections",
        data: { type: "root" },
        icon: "sm-collection-icon-color",
        children: collections.map((col) => ({
          key: String(col.collectionId),
          label: col.name,
          data: col,
          icon: "sm-collection-icon",
        })),
      },
      {
        key: "stig",
        label: "stigs",
        data: [],
        icon: "sm-collection-icon-color",
        children: [],
      },
      {
        key: "somethin",
        label: "something else",
        data: [],
        icon: "sm-collection-icon-color",
        children: [],
      },
    ]
  }, [collectionsQuery.data])

  return {
    nodes,
    loading: collectionsQuery.isFetching || collectionsQuery.isLoading,
    error: collectionsQuery.error,
    collectionsQuery,
  }
}
