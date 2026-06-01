import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

/**
 * EditableProject
 *
 * Generic CRUD component for arrays of card-style items.
 * Used for: projects, alsoBuilt, currentlyBuilding.
 *
 * Props:
 *   items        — array of objects
 *   onSave       — async (newList) => void
 *   renderItem   — (item, index) => ReactNode — renders one item in view mode
 *   formFields   — [{ key, label, type, placeholder, multiline }] — fields to render in the modal
 *   addLabel     — string shown in the + button
 */
export default function EditableProject({
  items = [],
  onSave,
  renderItem,
  formFields = [],
  addLabel = 'add item',
}) {
  const { isAdmin } = useCMS();
  const [modalItem, setModalItem] = useState(null);
  const [saving, setSaving] = useState(false);

  if (!isAdmin) {
    return <>{items.map((item, i) => renderItem(item, i))}</>;
  }

  const sorted = [...items].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const save = async (list) => {
    setSaving(true);
    try { await onSave(list); } finally { setSaving(false); }
  };

  const handleSaveItem = async (entry) => {
    const isNew = !items.find((e) => e.id === entry.id);
    const updated = isNew
      ? [...items, { ...entry, id: entry.id || crypto.randomUUID(), displayOrder: items.length + 1 }]
      : items.map((e) => (e.id === entry.id ? entry : e));
    await save(updated);
    setModalItem(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('delete this item?')) return;
    await save(items.filter((e) => e.id !== id));
  };

  const handleMove = async (index, dir) => {
    const list = [...sorted];
    const swapIdx = index + dir;
    if (swapIdx < 0 || swapIdx >= list.length) return;
    [list[index].displayOrder, list[swapIdx].displayOrder] = [list[swapIdx].displayOrder, list[index].displayOrder];
    await save(list);
  };

  return (
    <>
      {sorted.map((item, i) => (
        <div key={item.id || i} className="cms-entry-wrap">
          <div className="cms-entry-controls">
            <button className="cms-icon-btn" onClick={() => handleMove(i, -1)} disabled={i === 0}>↑</button>
            <button className="cms-icon-btn" onClick={() => handleMove(i, 1)} disabled={i === sorted.length - 1}>↓</button>
            <button className="cms-icon-btn" onClick={() => setModalItem(item)}>✎</button>
            <button className="cms-icon-btn cms-delete-btn" onClick={() => handleDelete(item.id)}>×</button>
          </div>
          {renderItem(item, i)}
        </div>
      ))}
      <button className="cms-add-entry-btn" onClick={() => setModalItem({})}>
        + {addLabel}
      </button>
      {modalItem !== null && (
        <ProjectModal
          item={modalItem}
          fields={formFields}
          onSave={handleSaveItem}
          onClose={() => setModalItem(null)}
        />
      )}
    </>
  );
}

function ProjectModal({ item, fields, onSave, onClose }) {
  const initForm = {};
  fields.forEach(({ key, defaultValue }) => {
    initForm[key] = item?.[key] ?? defaultValue ?? '';
  });
  const [form, setForm] = useState(initForm);
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSave = async () => {
    const parsed = { ...item, ...form, id: item?.id || crypto.randomUUID() };
    // Parse comma-separated and newline-separated fields
    fields.forEach(({ key, parseAs }) => {
      if (parseAs === 'array-comma') {
        parsed[key] = String(form[key]).split(',').map((s) => s.trim()).filter(Boolean);
      } else if (parseAs === 'array-newline') {
        parsed[key] = String(form[key]).split('\n').map((s) => s.trim()).filter(Boolean);
      }
    });
    setSaving(true);
    try { await onSave(parsed); } finally { setSaving(false); }
  };

  return (
    <div className="cms-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cms-modal">
        <div className="cms-modal-header">
          <span>{item?.id ? 'edit' : 'add'}</span>
          <button className="cms-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="cms-modal-body">
          {fields.map(({ key, label, placeholder, multiline, parseAs }) => (
            <div key={key} className="cms-form-row">
              <label>{label}</label>
              {multiline ? (
                <textarea
                  className="cms-textarea-input"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  rows={4}
                  placeholder={placeholder}
                />
              ) : (
                <input
                  className="cms-text-input"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={placeholder}
                />
              )}
            </div>
          ))}
        </div>
        <div className="cms-modal-footer">
          <button className="cms-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'saving…' : 'save'}
          </button>
          <button className="cms-cancel-btn" onClick={onClose}>cancel</button>
        </div>
      </div>
    </div>
  );
}
