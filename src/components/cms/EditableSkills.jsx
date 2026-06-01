import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

/**
 * EditableSkills
 *
 * Manages skill groups: languages, frameworks, infrastructure, aiml.
 * In view mode: renders comma/dot-separated lists exactly as before.
 * In edit mode: each tag gets an × remove button, plus an add input per group.
 *
 * Props:
 *   skills       — { languages: [], frameworks: [], infrastructure: [], aiml: [] }
 *   onSave       — async (newSkills) => void
 *   renderGroup  — (groupLabel, items) => ReactNode — how to render in view mode
 */
export default function EditableSkills({ skills, onSave, renderGroup }) {
  const { isAdmin } = useCMS();
  const [draft, setDraft] = useState({ ...skills });
  const [newSkill, setNewSkill] = useState({ languages: '', frameworks: '', infrastructure: '', aiml: '' });
  const [saving, setSaving] = useState(null); // which group is saving

  const groups = [
    { key: 'languages', label: 'languages' },
    { key: 'frameworks', label: 'frameworks' },
    { key: 'infrastructure', label: 'infrastructure' },
    { key: 'aiml', label: 'ai / ml' },
  ];

  if (!isAdmin) {
    return <>{groups.map(({ key, label }) => renderGroup(label, skills[key] || []))}</>;
  }

  const saveGroup = async (key, newList) => {
    const updated = { ...draft, [key]: newList };
    setSaving(key);
    try {
      await onSave(updated);
      setDraft(updated);
    } finally {
      setSaving(null);
    }
  };

  const removeSkill = (key, index) => {
    const updated = draft[key].filter((_, i) => i !== index);
    saveGroup(key, updated);
  };

  const addSkill = async (key) => {
    const val = newSkill[key].trim();
    if (!val) return;
    const updated = [...(draft[key] || []), val];
    await saveGroup(key, updated);
    setNewSkill((prev) => ({ ...prev, [key]: '' }));
  };

  return (
    <>
      {groups.map(({ key, label }) => (
        <div key={key} className="skill-group">
          <div className="skill-group-label">{label}</div>
          <div className="skill-items cms-skills-edit">
            {(draft[key] || []).map((skill, i) => (
              <span key={i} className="cms-skill-tag">
                {skill}
                <button
                  className="cms-skill-remove"
                  onClick={() => removeSkill(key, i)}
                  disabled={saving === key}
                  title="remove"
                >
                  ×
                </button>
              </span>
            ))}
            <span className="cms-skill-add-row">
              <input
                className="cms-text-input cms-skill-input"
                value={newSkill[key]}
                onChange={(e) => setNewSkill((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder="add skill"
                onKeyDown={(e) => { if (e.key === 'Enter') addSkill(key); }}
                disabled={saving === key}
              />
              <button
                className="cms-add-btn"
                onClick={() => addSkill(key)}
                disabled={saving === key || !newSkill[key].trim()}
              >
                +
              </button>
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
