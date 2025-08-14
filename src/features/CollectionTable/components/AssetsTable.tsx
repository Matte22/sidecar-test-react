import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../auth/authContext';
import type { Collection } from './CollectionsTable';

export default function AssetsTable({ collection }: { collection: Collection | null }) {
  const { token } = useAuth();
  const [labels, setLabels] = useState<Map<number,string> | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const collectionId = collection?.collectionId;

  useEffect(() => {
    let alive = true;
    async function loadAll() {
      if (!collectionId || !token) return;
      setLoading(true);
      try {
        const lblRes = await fetch(`http://localhost:64001/api/collections/${collectionId}/labels`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lblData: Array<{ labelId: number; name: string; color: string; textColor: string }> = await lblRes.json();
        const map = new Map<number,string>();
        for (const l of lblData) {
          const style = `color:#${l.textColor}; background-color:#${l.color}; padding:2px 6px; border-radius:4px; margin-right:4px; font-size:12px;`;
          map.set(l.labelId, `<span style="${style}">${l.name}</span>`);
        }
        if (alive) setLabels(map);

        const assetsRes = await fetch(`http://localhost:64001/api/assets?collectionId=${collectionId}&projection=stigs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const assets = await assetsRes.json();
        if (alive) setRows(assets || []);
      } catch {
        if (alive) {
          setLabels(null);
          setRows([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }
    loadAll();
    return () => {
      alive = false;
    };
  }, [collectionId, token]);

  if (!collectionId) return null;

  return (
    <div style={{ margin: 20 }}>
      <h3>Assets ({rows.length})</h3>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Labels</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.assetId} style={tr}>
                <td style={td}>{r.name}</td>
                <td style={td} dangerouslySetInnerHTML={{ __html: renderLabels(r.labelIds, labels) }} />
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function renderLabels(ids: number[] | undefined, map: Map<number,string> | null) {
  if (!ids || !Array.isArray(ids) || !ids.length || !map) return { __html: '' };
  return { __html: ids.map((id) => map.get(id)).filter(Boolean).join('') };
}

const th = { textAlign: 'left', borderBottom: '1px solid #333', padding: '8px 6px' } as const;
const tr = { borderBottom: '1px solid #222' } as const;
const td = { padding: '8px 6px' } as const;