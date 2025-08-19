import React from "react";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

interface FlashcardProgressProps {
  known: number;
  learning: number;
  index: number;
  total: number;
  className?: string;
}

const FlashcardProgress: React.FC<FlashcardProgressProps> = ({
  known,
  learning,
  index,
  total,
  className,
}) => {
  const clamped = Math.max(0, Math.min(index, total)); // 0..total
  const value = total > 0 ? Math.round((clamped / total) * 100) : 0;

  return (
    <div className={`flex flex-col items-center gap-2 ${className ?? ""}`}>
      <progress className="progress w-80" value={value} max={100}></progress>
      <div className="flex items-center justify-between w-56 text-sm opacity-70 tabular-nums">
        <div className="flex badge badge-outline badge-error items-center gap-1">
          <RxCross2 className="text-red-500" />
          <span className="font-semibold text-base-content">{learning}</span>
        </div>
        <div className="font-medium">
          {clamped}/{total}
        </div>
        <div className="flex badge badge-outline badge-success items-center gap-1">
          <FaCheck className="text-green-500" />
          <span className="font-semibold text-base-content">{known}</span>
        </div>
      </div>
    </div>
  );
};

export default FlashcardProgress;