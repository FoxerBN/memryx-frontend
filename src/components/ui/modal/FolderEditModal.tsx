import { useEffect, useState } from "react";
import type { FolderEditModalProps, Mode } from "@/type/folderEditModal";




export default function FolderEditModal({
  open, onClose, folderId, initialName, onRename, onDelete,
}: FolderEditModalProps) {
  const [mode, setMode] = useState<Mode>("menu");
  const [name, setName] = useState(initialName);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMode("menu");
      setName(initialName);
      setSubmitting(false);
      setErr(null);
    }
  }, [open, initialName]);

  if (!open) return null;

  const handleSave = async () => {
    setErr(null);
    setSubmitting(true);
    const ok = await onRename(folderId, name);
    setSubmitting(false);
    if (ok) onClose(); else setErr("Could not rename folder.");
  };

  const handleDelete = async () => {
    setErr(null);
    setSubmitting(true);
    const ok = await onDelete(folderId);
    setSubmitting(false);
    if (ok) onClose(); else setErr("Could not delete folder.");
  };

  return (
    <div className="modal modal-open" role="dialog">
      <div className="modal-box">
        {mode === "menu" && (
          <>
            <h3 className="text-lg font-bold mb-2">Folder options</h3>
            <p className="text-sm mb-4">Choose an action for this folder.</p>
            {err && <div className="alert alert-error mb-3"><span>{err}</span></div>}
            <div className="modal-action">
              <button className="btn btn-outline" onClick={() => setMode("edit")}>
                Edit name
              </button>
              <button className="btn btn-error" onClick={() => setMode("confirm")}>
                Delete
              </button>
              <button className="btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        )}

        {mode === "edit" && (
          <>
            <h3 className="text-lg font-bold mb-2">Rename folder</h3>
            <div className="form-control">
              <input
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Folder name"
                disabled={submitting}
              />
            </div>
            {err && <div className="alert alert-error mt-3"><span>{err}</span></div>}
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={submitting || !name.trim() || name.trim() === initialName.trim()}
              >
                {submitting ? "Saving..." : "Save"}
              </button>
              <button className="btn btn-ghost" onClick={() => setMode("menu")} disabled={submitting}>
                Back
              </button>
              <button className="btn" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
            </div>
          </>
        )}

        {mode === "confirm" && (
          <>
            <h3 className="text-lg font-bold mb-2 text-error">Confirm delete</h3>
            <p className="text-sm">
              Are you sure you want to delete <b>{initialName}</b>? This cannot be undone.
            </p>
            {err && <div className="alert alert-error mt-3"><span>{err}</span></div>}
            <div className="modal-action">
              <button className="btn btn-error" onClick={handleDelete} disabled={submitting}>
                {submitting ? "Deleting..." : "Delete"}
              </button>
              <button className="btn btn-ghost" onClick={() => setMode("menu")} disabled={submitting}>
                Back
              </button>
              <button className="btn" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}
