import { useCMS } from '../../context/CMSContext';

/**
 * CMSToolbar
 *
 * Fixed bottom bar visible only when isAdmin=true.
 * Shows edit mode indicator + sign out button.
 */
export default function CMSToolbar({ onSignOut }) {
  const { isAdmin } = useCMS();

  if (!isAdmin) return null;

  return (
    <div className="cms-toolbar">
      <span className="cms-toolbar-indicator">
        <span className="cms-toolbar-dot" />
        edit mode active
      </span>
      <button className="cms-toolbar-signout" onClick={onSignOut}>
        sign out
      </button>
    </div>
  );
}
