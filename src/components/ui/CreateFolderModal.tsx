import { useRef, useEffect } from "react";
import type { CreateFolderModalProps } from "@/interface/createModal";

const CreateFolderModal = ({
  open,
  onClose,
  onCreate,
}: CreateFolderModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLFormElement>(null);

  const align = () => {
    const el = boxRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
  };

  useEffect(() => {
    if (!open) return;

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
      requestAnimationFrame(() => requestAnimationFrame(align));
    }, 100);

    const onViewportChange = () => {
      window.setTimeout(align, 50);
    };

    window.visualViewport?.addEventListener("resize", onViewportChange);
    window.visualViewport?.addEventListener("scroll", onViewportChange);

    const retryTimer = window.setTimeout(align, 450);

    return () => {
      clearTimeout(focusTimer);
      clearTimeout(retryTimer);
      window.visualViewport?.removeEventListener("resize", onViewportChange);
      window.visualViewport?.removeEventListener("scroll", onViewportChange);
    };
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
      <form ref={boxRef} className="modal-box" onSubmit={handleSubmit}>
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
          onFocus={() => setTimeout(align, 150)}
        />
        <p className="validator-hint text-sm mt-1">
          Must be 3–30 characters, start with a letter, and use only letters,
          numbers, spaces or dash
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
