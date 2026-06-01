import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

/**
 * EditableList
 *
 * Manages an ordered array of strings.
 * In view mode: renders each item via the `renderItem` prop.
 * In edit mode: shows each item with an inline edit + delete,
 *               plus an add-new row at the bottom.
 *
 * Props:
 *   items        — string[]
 *   onSave       — async (newItems: string[]) => void
 *   renderItem   — (item, index) => ReactNode — how to render each item in view mode
 *   placeholder  — placeholder for new-item input
 */
export default function EditableList({
  items = [],
  onSave,
  renderItem,
  placeholder = 'add item',
}) {
  const { isAdmin } = useCMS();
  const [editIndex, setEditIndex] = useState(null);
  const [drafts, setDrafts] = useState([...items]);
  const [newItem, setNewItem] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync when external items change
  if (JSON.stringify(drafts) !== JSON.stringify(items) && editIndex === null && !saving) {
    setDrafts([...items]);
  }

  if (!isAdmin) {
    return <>{items.map((item, i) => renderItem(item, i))}</>;
  }

  const save = async (newList) => {
    setSaving(true);
    try { await onSave(newList); setDrafts(newList); } finally { setSaving(false); }
  };

  const handleEditSave = async (index) => {
    const updated = [...drafts];
    await save(updated);
    setEditIndex(null);
  };

  const handleDelete = async (index) => {
    const updated = drafts.filter((_, i) => i !== index);
    await save(updated);
  };

  const handleAdd = async () => {
    if (!newItem.trim()) return;
    const updated = [...drafts, newItem.trim()];
    await save(updated);
    setNewItem('');
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const updated = [...drafts];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    await save(updated);
  };

  const handleMoveDown = async (index) => {
    if (index === drafts.length - 1) return;
    const updated = [...drafts];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    await save(updated);
  };

  return (
    <div className="cms-list">
      {drafts.map((item, i) => (
        <div key={i} className="cms-list-row">
          {editIndex === i ? (
            <>
              <input
                className="cms-text-input"
                value={drafts[i]}
                autoFocus
                onChange={(e) => {
                  const updated = [...drafts];
                  updated[i] = e.target.value;
                  setDrafts(updated);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEditSave(i);
                  if (e.key === 'Escape') { setDrafts([...items]); setEditIndex(null); }
                }}
              />
              <button className="cms-save-btn" onClick={() => handleEditSave(i)} disabled={saving}>✓</button>
              <button className="cms-cancel-btn" onClick={() => { setDrafts([...items]); setEditIndex(null); }}>✕</button>
            </>
          ) : (
            <>
              <span className="cms-list-content">{renderItem(item, i)}</span>
              <span className="cms-list-actions">
                <button className="cms-icon-btn" onClick={() => handleMoveUp(i)} title="move up" disabled={i === 0}>↑</button>
                <button className="cms-icon-btn" onClick={() => handleMoveDown(i)} title="move down" disabled={i === drafts.length - 1}>↓</button>
                <button className="cms-icon-btn" onClick={() => setEditIndex(i)} title="edit">✎</button>
                <button className="cms-icon-btn cms-delete-btn" onClick={() => handleDelete(i)} title="delete">×</button>
              </span>
            </>
          )}
        </div>
      ))}
      <div className="cms-add-row">
        <input
          className="cms-text-input"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
        />
        <button className="cms-add-btn" onClick={handleAdd} disabled={saving || !newItem.trim()}>
          + add
        </button>
      </div>
    </div>
  );
}
