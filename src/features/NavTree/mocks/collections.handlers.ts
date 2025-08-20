import { http, HttpResponse } from 'msw'

const mockCollections = [
  {
    collectionId: "1214109268",
    description: "Development environment collection",
    metadata: {
      environment: "dev",
      team: "backend",
      priority: "high"
    },
    name: "Dev Collection",
    owners: [
      {
        userId: "48",
        username: "john.doe",
        displayName: "John Doe"
      }
    ],
    settings: {
      fields: {
        comment: {
          enabled: "always",
          required: "findings"
        },
        detail: {
          enabled: "always", 
          required: "findings"
        }
      },
      history: {
        maxReviews: 5
      },
      status: {
        canAccept: true,
        minAcceptGrant: 2,
        resetCriteria: "result"
      },
      importOptions: {
        autoStatus: {
          fail: null,
          notapplicable: null,
          pass: null
        },
        unreviewed: "never",
        unreviewedCommented: "notchecked",
        emptyDetail: "ignore",
        emptyComment: "ignore",
        allowCustom: true
      }
    },
    statistics: {
      assetCount: 12,
      checklistCount: 3,
      created: "2025-08-15T18:49:25.300Z",
      userCount: 5
    }
  },
  {
    collectionId: "83",
    description: "Production environment collection", 
    metadata: {
      environment: "prod",
      team: "security",
      priority: "critical"
    },
    name: "Production Collection",
    owners: [
      {
        userId: "99",
        username: "jane.smith", 
        displayName: "Jane Smith"
      }
    ],
    settings: {
      fields: {
        comment: {
          enabled: "always",
          required: "findings"
        },
        detail: {
          enabled: "always",
          required: "findings" 
        }
      },
      history: {
        maxReviews: 10
      },
      status: {
        canAccept: true,
        minAcceptGrant: 3,
        resetCriteria: "result"
      },
      importOptions: {
        autoStatus: {
          fail: null,
          notapplicable: null,
          pass: null
        },
        unreviewed: "never",
        unreviewedCommented: "notchecked",
        emptyDetail: "ignore", 
        emptyComment: "ignore",
        allowCustom: false
      }
    },
    statistics: {
      assetCount: 45,
      checklistCount: 8,
      created: "2025-07-10T12:30:00.000Z",
      userCount: 15
    }
  }
]

export const collectionsHandlers = [
  http.get('http://localhost:64000/api/collections', () => {
    return HttpResponse.json(mockCollections)
  })
]