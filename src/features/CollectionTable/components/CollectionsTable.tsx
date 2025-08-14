import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../auth/authContext';

export type Collection = { collectionId: string; name: string };

export default function CollectionsTable({ onPick }: { onPick: (col: Collection) => void }) {
  const { token } = useAuth();
  const [rows, setRows] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:64001/api/collections', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (alive) setRows(data || []);
      } catch {
        if (alive) setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    }
    if (token) load();
    return () => {
      alive = false;
    };
  }, [token]);

  if (!token) return <div/>;

  return (
    <div style={{ margin: 20 }}>
      <h3>Collections ({rows.length})</h3>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Name</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.collectionId} style={tr} onClick={() => onPick(r)}>
                <td style={td}>{r.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = { textAlign: 'left', borderBottom: '1px solid #333', padding: '8px 6px' } as const;
const tr = { borderBottom: '1px solid #222', cursor: 'pointer' } as const;
const td = { padding: '8px 6px' } as const;