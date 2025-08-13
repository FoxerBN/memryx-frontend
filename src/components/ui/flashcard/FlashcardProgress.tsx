import React from "react";

interface FlashcardProgressProps {
  known: number;
  learning: number;
  index: number; // 0-based index aktuálnej karty
  total: number; // počet kariet v sete
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
      <progress className="progress w-56" value={value} max={100}></progress>
      <div className="text-sm opacity-70 tabular-nums">
        known: <span className="font-semibold">{known}</span>
        {"\u00A0\u00A0"}·{"\u00A0\u00A0"}
        still learning: <span className="font-semibold">{learning}</span>
        {"\u00A0\u00A0"}·{"\u00A0\u00A0"}
        {clamped}/{total}
      </div>
    </div>
  );
};

export default FlashcardProgress;
