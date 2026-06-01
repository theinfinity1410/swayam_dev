import { useState, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { supabase } from '../../lib/supabase';

/**
 * ResumeUpload
 *
 * Renders an upload button (only in admin mode) that:
 * 1. Uploads a PDF to Supabase Storage bucket 'resume'
 * 2. Replaces the existing resume.pdf
 * 3. Calls onSave({ fileName, url, lastUpdated }) to update the resume JSON field
 *
 * Props:
 *   resume   — { fileName, url, lastUpdated }
 *   onSave   — async (newResume) => void
 */
export default function ResumeUpload({ resume, onSave }) {
  const { isAdmin } = useCMS();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef(null);

  if (!isAdmin) return null;

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!supabase) { setError('Supabase not configured'); return; }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      // Upload to 'resume' bucket, always as 'resume.pdf' (overwrite)
      const { error: uploadError } = await supabase.storage
        .from('resume')
        .upload('resume.pdf', file, { upsert: true, contentType: 'application/pdf' });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage.from('resume').getPublicUrl('resume.pdf');
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`; // bust cache

      await onSave({
        fileName: file.name,
        url: data.publicUrl,
        lastUpdated: new Date().toISOString(),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'upload failed');
    } finally {
      setUploading(false);
      // Reset input so same file can be re-uploaded
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="cms-resume-upload">
      <div className="cms-resume-info">
        {resume?.fileName && (
          <span className="cms-resume-filename">
            current: {resume.fileName}
            {resume.lastUpdated && (
              <span className="cms-resume-date">
                {' '}· updated {new Date(resume.lastUpdated).toLocaleDateString()}
              </span>
            )}
          </span>
        )}
      </div>
      <label className="cms-upload-btn">
        {uploading ? 'uploading…' : success ? 'uploaded ✓' : 'replace resume ↑'}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
      {error && <span className="cms-error">{error}</span>}
    </div>
  );
}
