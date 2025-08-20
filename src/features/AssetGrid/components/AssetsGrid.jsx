import React, { useEffect, useCallback } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useAssetGrid } from '../hooks/useAssetsGrid'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'


export const AssetsGrid = ({ selectedData = null }) => {
  const { items, labels, loading, error, selectedAsset, metaKey, onSelectionChange } = useAssetGrid({ 
    selectedCollection: selectedData,
  })

  return (
    <div className="space-y-4">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assets</h2>
          <p className="mt-1 text-sm text-gray-500">
            {items?.length || 0} total assets found
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
        <DataTable
          value={items}
          loading={loading}
          selection={selectedAsset}
          onSelectionChange={onSelectionChange}
          selectionMode="single"
          dataKey="assetId"
          paginator
          rows={10}
          resizableColumns
          showGridlines
          metaKeySelection
          className="border-0"
          emptyMessage={
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg">No assets found</div>
              <div className="text-gray-400 text-sm mt-2">Select a collection to view its assets</div>
            </div>
          }
          pt={{
            header: { className: 'bg-gray-50 border-t border-gray-200' },
            headerCell: { className: 'text-sm font-medium text-gray-500' },
            bodyCell: { className: 'text-sm text-gray-600' }
          }}
        >
          <Column field="name" header="Name" sortable className="font-medium" />
          <Column
            header="Labels"
            className="w-48"
            body={useCallback((rowData) => {
              if (!labels || !Array.isArray(rowData.labelIds) || !rowData.labelIds.length) return null
              return (
                <div className="label-list">
                  {rowData.labelIds.map(lid => {
                    const label = labels.get(lid)
                    if (!label) return null
                    return (
                      <span
                        key={lid}
                        className="sm-label-sprite"
                        style={{
                          backgroundColor: label.bgColor,
                          color: label.textColor
                        }}
                      >
                        {label.name}
                      </span>
                    )
                  })}
                </div>
              )
            }, [labels])}
          />
          <Column field="fqdn" header="FQDN" sortable />
          <Column field="ip" header="IP" sortable className="w-36" />
          <Column
            header="Benchmarks"
            className="w-48"
            body={useCallback((rowData) => {
              if (!Array.isArray(rowData.stigs) || !rowData.stigs.length) return null
              return (
                <span>
                  {rowData.stigs.map((stig, idx) => (
                    <React.Fragment key={stig.benchmarkId}>
                      {stig.benchmarkId}
                      {idx < rowData.stigs.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </span>
              )
            }, [])}
          />
        </DataTable>
      </div>

      <style>{`
        .label-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
          align-items: center;
        }
        
        .sm-label-sprite {
          font-size: 85%;
          font-weight: 500;
          padding: 0.125rem 0.625rem;
          border-radius: 9999px;
          white-space: nowrap;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        /* PrimeReact DataTable customizations */
        .p-datatable .p-datatable-header {
          background: transparent;
          border: none;
          padding: 1rem;
        }

        .p-datatable .p-datatable-thead > tr > th {
          background: transparent;
          border-width: 0 0 1px 0;
          padding: 0.75rem 1rem;
        }

        .p-datatable .p-datatable-tbody > tr {
          background: transparent;
        }

        .p-datatable .p-datatable-tbody > tr > td {
          border-width: 0 0 1px 0;
          padding: 0.75rem 1rem;
        }

        .p-datatable .p-paginator {
          background: transparent;
          border: none;
          padding: 1rem;
        }

        .p-datatable .p-paginator .p-paginator-current,
        .p-datatable .p-paginator .p-paginator-first,
        .p-datatable .p-paginator .p-paginator-prev,
        .p-datatable .p-paginator .p-paginator-next,
        .p-datatable .p-paginator .p-paginator-last {
          min-width: 2.5rem;
          height: 2.5rem;
        }

        .p-datatable.p-datatable-gridlines .p-datatable-header {
          border: none;
        }
      `}</style>
    </div>
  )
}