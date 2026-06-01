import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook: useContent
 * Fetches the single site_content row from Supabase.
 * Falls back to null if Supabase is not configured.
 *
 * Returns: { content, loading, error, updateSection }
 *   content        — the full site_content row (or null)
 *   loading        — true while fetching
 *   error          — fetch error if any
 *   updateSection  — async (key, value) => saves one section to Supabase
 */
export function useContent() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('site_content')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError(fetchError);
        } else {
          setContent(data);
        }
        setLoading(false);
      });
  }, []);

  /**
   * updateSection — upserts a single top-level key in site_content.
   * Optimistically updates local state before the DB call resolves.
   *
   * @param {string} key   — e.g. 'hero', 'about', 'experience'
   * @param {any}    value — the new value for that key
   */
  const updateSection = useCallback(async (key, value) => {
    if (!supabase) return;

    // Optimistic local update
    setContent((prev) => ({ ...prev, [key]: value }));

    const { error: updateError } = await supabase
      .from('site_content')
      .update({ [key]: value, updated_at: new Date().toISOString() })
      .eq('id', 1);

    if (updateError) {
      console.error('[CMS] Failed to save:', key, updateError);
      throw updateError;
    }
  }, []);

  return { content, loading, error, updateSection };
}
