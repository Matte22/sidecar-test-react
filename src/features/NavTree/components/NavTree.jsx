import { useEffect, useMemo, useState, useCallback } from "react"
import { Tree } from "primereact/tree"
import { useNavTreeCollections } from "../hooks/useNavTreeCollections"

export default function NavTree({onSelectedDataChange }) {
  const { nodes, loading } = useNavTreeCollections()

  const [expandedKeys, setExpandedKeys] = useState({ collections: true })
  const [selectionKeys, setSelectionKeys] = useState({})

  useEffect(() => {
    onSelectedDataChange?.(selectionKeys)
  }, [selectionKeys, nodes, onSelectedDataChange])


  // dont update value unless  nodes change
  const value = useMemo(() => nodes, [nodes])

  const renderNode = useCallback((node) => (
    <span className="sm-node">
      {node.icon ? <span className={`sm-icon ${node.icon}`} /> : null}
      <span className="sm-label">{node.label}</span>
    </span>
  ), [])

  const handleSelectionChange = useCallback((e) => setSelectionKeys(e.value), [])
  const handleToggle = useCallback((e) => setExpandedKeys(e.value), [])

  return (
    <aside className="sm-nav-tree">
      <Tree
        value={value}
        loading={loading}
        selectionMode="single"
        selectionKeys={selectionKeys}
        onSelectionChange={handleSelectionChange}
        expandedKeys={expandedKeys}
        onToggle={handleToggle}
        nodeTemplate={renderNode}
        className="p-tree-sm custom-tree"
      />
    </aside>
  )
}
