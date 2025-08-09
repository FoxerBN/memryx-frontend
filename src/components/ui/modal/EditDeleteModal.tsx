import type { EditDeleteModalProps } from "@/interface/editDeleteModal";
export default function EditDeleteModal({
  open,
  onClose,
  onEdit,
  onDeleteClick,
  onConfirmDelete,
  confirmDelete,
  title = "Deck options",
  description = "Choose an action for this deck.",
  deleteConfirmText = "Are you sure you want to delete this deck?",
  children,
}: EditDeleteModalProps) {
  if (!open) return null;

  return (
    <div className="modal modal-open" role="dialog">
      <div className="modal-box">
        {!confirmDelete ? (
          <>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-sm mb-4">{description}</p>
            {children}
            <div className="modal-action">
              <button className="btn btn-outline" onClick={onEdit}>
                Edit
              </button>
              <button className="btn btn-error" onClick={onDeleteClick}>
                Delete
              </button>
              <button className="btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold mb-2 text-error">
              Confirm delete
            </h3>
            <p className="text-sm">{deleteConfirmText}</p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={onConfirmDelete}>
                Delete
              </button>
              <button className="btn btn-ghost" onClick={onDeleteClick}>
                Back
              </button>
              <button className="btn" onClick={onClose}>
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
