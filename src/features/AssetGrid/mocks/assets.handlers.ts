// import { http, HttpResponse } from 'msw'

// const mockAssets: Record<string, Asset[]> = {
//   "83": [
//     {
//       assetId: "asset-1",
//       name: "Web Server 01",
//       description: "Primary web server for production",
//       ip: "192.168.1.100",
//       fqdn: "web01.company.com",
//       mac: "00:1B:63:84:45:E6",
//       noncomputing: false,
//       metadata: {
//         os: "Ubuntu 20.04",
//         location: "Data Center A"
//       },
//       stigs: [
//         {
//           benchmark: "STIG-001",
//           lastRevisionStr: "V1R2",
//           revisionStr: "V1R2", 
//           ruleCount: 156,
//           title: "Ubuntu Server STIG"
//         }
//       ],
//       metrics: {
//         assessments: 150,
//         assessed: 156,
//         statuses: {
//           open: 12,
//           notAFinding: 144,
//           notApplicable: 0
//         }
//       }
//     },
//     {
//       assetId: "asset-2",
//       name: "Database Server 01", 
//       description: "Primary MySQL database server",
//       ip: "192.168.1.200",
//       fqdn: "db01.company.com",
//       mac: "00:1B:63:84:45:E7",
//       noncomputing: false,
//       metadata: {
//         os: "CentOS 8",
//         location: "Data Center A"
//       },
//       stigs: [
//         {
//           benchmark: "STIG-002",
//           lastRevisionStr: "V2R1",
//           revisionStr: "V2R1",
//           ruleCount: 89,
//           title: "MySQL STIG"
//         }
//       ],
//       metrics: {
//         assessments: 85,
//         assessed: 89,
//         statuses: {
//           open: 3,
//           notAFinding: 82,
//           notApplicable: 4
//         }
//       }
//     },
//     {
//       assetId: "asset-3",
//       name: "Load Balancer",
//       description: "HAProxy load balancer",
//       ip: "192.168.1.50",
//       fqdn: "lb01.company.com", 
//       noncomputing: true,
//       metadata: {
//         device_type: "Network Device",
//         location: "Data Center A"
//       },
//       metrics: {
//         assessments: 0,
//         assessed: 0,
//         statuses: {}
//       }
//     }
//   ],
//   "1214109268": [
//     {
//       assetId: "dev-asset-1",
//       name: "Dev Web Server",
//       description: "Development web server",
//       ip: "10.0.1.100", 
//       fqdn: "dev-web01.company.local",
//       mac: "00:1B:63:84:45:E8",
//       noncomputing: false,
//       metadata: {
//         os: "Ubuntu 22.04",
//         location: "Development Lab"
//       },
//       stigs: [
//         {
//           benchmark: "STIG-001",
//           lastRevisionStr: "V1R2",
//           revisionStr: "V1R2",
//           ruleCount: 156,
//           title: "Ubuntu Server STIG"
//         }
//       ],
//       metrics: {
//         assessments: 120,
//         assessed: 156,
//         statuses: {
//           open: 25,
//           notAFinding: 95,
//           notApplicable: 36
//         }
//       }
//     },
//     {
//       assetId: "dev-asset-2",
//       name: "Dev Database",
//       description: "Development database server",
//       ip: "10.0.1.200",
//       fqdn: "dev-db01.company.local",
//       noncomputing: false,
//       metadata: {
//         os: "Ubuntu 22.04",
//         location: "Development Lab"
//       },
//       metrics: {
//         assessments: 45,
//         assessed: 67,
//         statuses: {
//           open: 15,
//           notAFinding: 30,
//           notApplicable: 22
//         }
//       }
//     }
//   ]
// }

// export const assetsHandlers = [
//   http.get('http://localhost:64000/api/collections/:collectionId/metrics/summary/asset', ({ params }) => {
//     const { collectionId } = params as { collectionId: string }
//     const assets = mockAssets[collectionId] || []
//     return HttpResponse.json(assets)
//   })
// ]