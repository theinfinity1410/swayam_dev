import { createContext, useContext } from 'react';

/**
 * CMSContext — shared CMS state available to all portfolio sections.
 *
 * isAdmin       — true when the logged-in user is the admin
 * content       — the full site_content object from Supabase (or null → use local fallback)
 * updateSection — async (key, value) → saves to Supabase
 * user          — raw Supabase user object
 */
export const CMSContext = createContext({
  isAdmin: false,
  content: null,
  updateSection: async () => {},
  user: null,
});

export function useCMS() {
  return useContext(CMSContext);
}
