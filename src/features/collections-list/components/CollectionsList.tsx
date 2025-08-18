import React from 'react'
import { useCollections } from '../hooks/useCollections'
import { useCollectionStore } from '@/state/collectionStore'

export const CollectionsList = () => {
  const { data: collections, isLoading, error } = useCollections()
  const { selectedCollectionId, setSelectedCollectionId } = useCollectionStore()

  if (isLoading) return <div className="p-4">Loading collections...</div>
  if (error) {
    console.error('Collections error:', error)
    return (
      <div className="p-4 text-red-500">
        <div className="font-medium">Error loading collections</div>
        <div className="text-sm mt-1">{error.message}</div>
      </div>
    )
  }
  if (!collections || collections.length === 0) {
    return <div className="p-4">No collections found</div>
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 h-full overflow-y-auto flex-shrink-0">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Collections</h2>
        <p className="text-sm text-gray-500 mt-1">Select a collection to view assets</p>
      </div>
      <div className="p-3">
        {collections.map((collection) => (
          <button
            key={collection.collectionId}
            onClick={() => setSelectedCollectionId(collection.collectionId)}
            className={`w-full text-left p-4 rounded-lg mb-2 transition-all duration-200 border ${
              selectedCollectionId === collection.collectionId
                ? 'bg-blue-50 border-blue-200 shadow-sm'
                : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className={`font-medium text-sm truncate ${
                  selectedCollectionId === collection.collectionId 
                    ? 'text-blue-900' 
                    : 'text-gray-900'
                }`}>
                  {collection.name}
                </div>
                {collection.description && (
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {collection.description}
                  </div>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>{collection.statistics?.assetCount || 0} assets</span>
                  <span>{collection.statistics?.userCount || 0} users</span>
                </div>
              </div>
              {selectedCollectionId === collection.collectionId && (
                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}