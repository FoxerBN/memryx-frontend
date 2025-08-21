import { RiShuffleLine, RiArrowUpDownLine, RiListOrdered } from "react-icons/ri";
import type { StudyOptionsModalProps } from "@/interface/studyOptionsModal";

const StudyOptionsModal = ({ open, onClose, onSelect, current }: StudyOptionsModalProps) => {
  const selectAndClose = (mode: "original" | "reverse" | "random") => {
    onSelect(mode);
    onClose();
  };

  const iconButtonClass = (active: boolean) =>
    `btn btn-circle btn-lg ${active ? "btn-primary" : "btn-outline"}`;

  return (
    <dialog open={open} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <button
          type="button"
          className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <h3 className="font-bold text-lg mb-4 text-center">Study options order</h3>

        <div className="space-y-6">
          {/* Top row: Reverse + Random side by side */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <button
                type="button"
                className={iconButtonClass(current === "reverse")}
                aria-pressed={current === "reverse"}
                onClick={() => selectAndClose("reverse")}
                aria-label="Reverse order"
              >
                <RiArrowUpDownLine className="text-2xl" />
              </button>
              <div className="text-xs mt-2">Reverse</div>
            </div>

            <div className="flex flex-col items-center">
              <button
                type="button"
                className={iconButtonClass(current === "random")}
                aria-pressed={current === "random"}
                onClick={() => selectAndClose("random")}
                aria-label="Random order"
              >
                <RiShuffleLine className="text-2xl" />
              </button>
              <div className="text-xs mt-2">Random</div>
            </div>
          </div>

          {/* Bottom row: Original centered */}
          <div className="flex justify-center">
            <button
              type="button"
              className={`btn ${current === "original" ? "btn-primary" : "btn-outline"}`}
              aria-pressed={current === "original"}
              onClick={() => selectAndClose("original")}
            >
              <RiListOrdered className="text-xl mr-2" />
              Original
            </button>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-outline" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default StudyOptionsModal;
