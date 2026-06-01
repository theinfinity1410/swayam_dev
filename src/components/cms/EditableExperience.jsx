import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

const EMPTY_EXP = {
  id: '',
  company: '',
  role: '',
  employmentType: '',
  location: '',
  locationType: '',
  startDate: '',
  endDate: '',
  duration: '',
  summary: '',
  description: [],
  techStack: [],
  companyUrl: '',
  companyLogo: '',
  displayOrder: 1,
};

function ExpModal({ exp, onSave, onClose }) {
  const [form, setForm] = useState({
    ...EMPTY_EXP,
    ...exp,
    description: exp?.description?.join('\n') ?? '',
    techStack: exp?.techStack?.join(', ') ?? '',
  });
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSave = async () => {
    const parsed = {
      ...form,
      id: form.id || crypto.randomUUID(),
      description: form.description.split('\n').map((s) => s.trim()).filter(Boolean),
      techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean),
    };
    setSaving(true);
    try { await onSave(parsed); onClose(); } finally { setSaving(false); }
  };

  return (
    <div className="cms-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cms-modal">
        <div className="cms-modal-header">
          <span>{exp?.id ? 'edit experience' : 'add experience'}</span>
          <button className="cms-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="cms-modal-body">
          <div className="cms-form-row">
            <label>role</label>
            <input className="cms-text-input" value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="software developer" />
          </div>
          <div className="cms-form-row">
            <label>company</label>
            <input className="cms-text-input" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Company Name" />
          </div>
          <div className="cms-form-row">
            <label>employment type</label>
            <input className="cms-text-input" value={form.employmentType} onChange={(e) => set('employmentType', e.target.value)} placeholder="internship / full-time / freelance" />
          </div>
          <div className="cms-form-row">
            <label>location</label>
            <input className="cms-text-input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="pune" />
          </div>
          <div className="cms-form-row">
            <label>start date</label>
            <input className="cms-text-input" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} placeholder="Jul 2025" />
          </div>
          <div className="cms-form-row">
            <label>end date</label>
            <input className="cms-text-input" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} placeholder="Jan 2026 or present" />
          </div>
          <div className="cms-form-row">
            <label>duration</label>
            <input className="cms-text-input" value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="6 months" />
          </div>
          <div className="cms-form-row">
            <label>description (one bullet per line)</label>
            <textarea
              className="cms-textarea-input"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={5}
              placeholder="built X&#10;shipped Y&#10;scaled Z"
            />
          </div>
          <div className="cms-form-row">
            <label>tech stack (comma separated)</label>
            <input className="cms-text-input" value={form.techStack} onChange={(e) => set('techStack', e.target.value)} placeholder="python, fastapi, redis" />
          </div>
          <div className="cms-form-row">
            <label>company url</label>
            <input className="cms-text-input" value={form.companyUrl} onChange={(e) => set('companyUrl', e.target.value)} placeholder="https://company.com" />
          </div>
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

/**
 * EditableExperience
 *
 * Renders experience entries with full CRUD + ↑↓ reorder in edit mode.
 *
 * Props:
 *   experience   — experience[]
 *   onSave       — async (newList) => void
 *   renderEntry  — (exp, index) => ReactNode — renders one entry in view mode
 */
export default function EditableExperience({ experience = [], onSave, renderEntry }) {
  const { isAdmin } = useCMS();
  const [modalEntry, setModalEntry] = useState(null); // null=closed, 'new'=add, obj=edit
  const [saving, setSaving] = useState(false);

  if (!isAdmin) {
    return <>{experience.map((exp, i) => renderEntry(exp, i))}</>;
  }

  const sorted = [...experience].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const save = async (list) => {
    setSaving(true);
    try { await onSave(list); } finally { setSaving(false); }
  };

  const handleSaveEntry = async (entry) => {
    const isNew = !experience.find((e) => e.id === entry.id);
    let updated;
    if (isNew) {
      updated = [...experience, { ...entry, displayOrder: experience.length + 1 }];
    } else {
      updated = experience.map((e) => (e.id === entry.id ? entry : e));
    }
    await save(updated);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('delete this experience?')) return;
    const updated = experience.filter((e) => e.id !== id);
    await save(updated);
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
      {sorted.map((exp, i) => (
        <div key={exp.id} className="cms-entry-wrap">
          <div className="cms-entry-controls">
            <button className="cms-icon-btn" onClick={() => handleMove(i, -1)} disabled={i === 0}>↑</button>
            <button className="cms-icon-btn" onClick={() => handleMove(i, 1)} disabled={i === sorted.length - 1}>↓</button>
            <button className="cms-icon-btn" onClick={() => setModalEntry(exp)}>✎</button>
            <button className="cms-icon-btn cms-delete-btn" onClick={() => handleDelete(exp.id)}>×</button>
          </div>
          {renderEntry(exp, i)}
        </div>
      ))}
      <button className="cms-add-entry-btn" onClick={() => setModalEntry('new')}>
        + add experience
      </button>
      {modalEntry && (
        <ExpModal
          exp={modalEntry === 'new' ? null : modalEntry}
          onSave={handleSaveEntry}
          onClose={() => setModalEntry(null)}
        />
      )}
    </>
  );
}
