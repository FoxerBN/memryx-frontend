type StudyOrder = "original" | "reverse" | "random";

export interface OptionButtonProps {
  mode: StudyOrder;
  label: string;
  description?: string;
  current: StudyOrder;
  onSelect: (mode: StudyOrder) => void;
  onClose: () => void;
}

export default function OptionButton({
  mode,
  label,
  description,
  current,
  onSelect,
  onClose,
}: OptionButtonProps) {
  const isActive = current === mode;

  return (
    <button
      type="button"
      className={`btn btn- justify-start mb-2 ${isActive ? "btn-info" : "btn-secondary"}`}
      data-active={isActive ? "true" : "false"}
      aria-pressed={isActive}
      onClick={() => {
        onSelect(mode);
        onClose();
      }}
    >
      <div className="text-left">
        <div className="font-medium">{label}</div>
        {description ? <div className="text-xs opacity-70">{description}</div> : null}
      </div>
    </button>
  );
}
