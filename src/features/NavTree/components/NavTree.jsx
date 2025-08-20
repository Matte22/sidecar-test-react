import { useEffect, useMemo, useState } from "react"
import { Tree } from "primereact/tree"
import { useNavTreeCollections } from "../hooks/useNavTreeCollections"

export default function NavTree({onSelectedDataChange }) {
  const { nodes, loading } = useNavTreeCollections()

  const [expandedKeys, setExpandedKeys] = useState({ collections: true })
  const [selectionKeys, setSelectionKeys] = useState({})

  useEffect(() => {
    onSelectedDataChange?.(selectionKeys)
  }, [selectionKeys, nodes, onSelectedDataChange])


  const value = useMemo(() => nodes, [nodes])

  return (
    <aside className="sm-nav-tree">
      <Tree
        value={value}
        loading={loading}
        selectionMode="single"
        selectionKeys={selectionKeys}
        onSelectionChange={(e) => setSelectionKeys(e.value)}
        expandedKeys={expandedKeys}
        onToggle={(e) => setExpandedKeys(e.value)}
        nodeTemplate={(node) => (
          <span className="sm-node">
            {node.icon ? <span className={`sm-icon ${node.icon}`} /> : null}
            <span className="sm-label">{node.label}</span>
          </span>
        )}
        className="p-tree-sm custom-tree"
      />
    </aside>
  )
}
