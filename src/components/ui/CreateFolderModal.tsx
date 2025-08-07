import { useRef, useEffect } from "react";
import type { CreateFolderModalProps } from "@/interface/createModal";

const CreateFolderModal = ({ open, onClose, onCreate }: CreateFolderModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const modalBoxRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        modalBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 200);
    }
  }, [open]);

  const handleCreate = () => {
    const value = inputRef.current?.value.trim();
    if (value && inputRef.current?.checkValidity()) {
      onCreate(value);
      onClose();
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreate();
  };

  return (
    <dialog open={open} className="modal modal-bottom sm:modal-middle">
      <form ref={modalBoxRef} className="modal-box" onSubmit={handleSubmit}>
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="font-bold text-lg mb-4">New Folder</h3>

        <input
          ref={inputRef}
          type="text"
          className="input input-bordered validator w-full"
          required
          placeholder="Folder name"
          minLength={3}
          maxLength={30}
          title="Only letters, numbers, spaces or dash. Must start with a letter."
        />
        <p className="validator-hint text-sm mt-1">
          Must be 3–30 characters, start with a letter, and use only letters, numbers, spaces or dash
        </p>

        <div className="modal-action">
          <button className="btn btn-outline" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            Create
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default CreateFolderModal;
