import { useState, useRef, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';

/**
 * EditableText
 *
 * Renders a simple inline editable text field.
 * In view mode: renders children as-is (any element via `as` prop).
 * In edit mode: clicking the text turns it into an input.
 *
 * Props:
 *   value        — current string value
 *   onSave       — async (newValue) => void
 *   as           — HTML tag or component to wrap in view mode (default: 'span')
 *   className    — applied to both view and edit elements
 *   placeholder  — input placeholder
 */
export default function EditableText({
  value,
  onSave,
  as: Tag = 'span',
  className = '',
  placeholder = '',
  style,
}) {
  const { isAdmin } = useCMS();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  // Sync external value changes
  useEffect(() => { setDraft(value); }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  if (!isAdmin) {
    return <Tag className={className} style={style}>{value}</Tag>;
  }

  const handleSave = async () => {
    if (draft === value) { setEditing(false); return; }
    setSaving(true);
    try {
      await onSave(draft);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') { setDraft(value); setEditing(false); }
  };

  if (editing) {
    return (
      <span className="cms-inline-edit">
        <input
          ref={inputRef}
          className={`cms-text-input ${className}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={saving}
        />
        <button className="cms-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? '…' : '✓'}
        </button>
        <button className="cms-cancel-btn" onClick={() => { setDraft(value); setEditing(false); }}>
          ✕
        </button>
      </span>
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
