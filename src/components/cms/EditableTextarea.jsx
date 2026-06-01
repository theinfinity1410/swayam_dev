import { useState, useRef, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';

/**
 * EditableTextarea
 *
 * Renders a multi-line editable block.
 * In view mode: renders as a <p> (or custom `as` tag).
 * In edit mode: expands into a textarea with save/cancel.
 *
 * Props:
 *   value       — current string value
 *   onSave      — async (newValue) => void
 *   as          — HTML tag for view mode (default: 'p')
 *   className   — applied to both modes
 *   placeholder — textarea placeholder
 *   rows        — textarea rows (default: 4)
 */
export default function EditableTextarea({
  value,
  onSave,
  as: Tag = 'p',
  className = '',
  placeholder = '',
  rows = 4,
  style,
}) {
  const { isAdmin } = useCMS();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);

  if (!isAdmin) {
    return <Tag className={className} style={style}>{value}</Tag>;
  }

  const handleSave = async () => {
    if (draft === value) { setEditing(false); return; }
    setSaving(true);
    try { await onSave(draft); } finally { setSaving(false); setEditing(false); }
  };

  if (editing) {
    return (
      <div className="cms-textarea-wrap">
        <textarea
          ref={ref}
          className={`cms-textarea-input ${className}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          disabled={saving}
        />
        <div className="cms-action-row">
          <button className="cms-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'saving…' : 'save'}
          </button>
          <button className="cms-cancel-btn" onClick={() => { setDraft(value); setEditing(false); }}>
            cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <Tag
      className={`${className} cms-editable-field`}
      style={style}
      onClick={() => setEditing(true)}
      title="click to edit"
    >
      {value || <span className="cms-empty-placeholder">{placeholder || 'click to edit'}</span>}
    </Tag>
  );
}
