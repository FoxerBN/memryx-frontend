import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import type { FlashcardFieldProps } from '@/interface/flashcardFieldProps';

const DeckFlashcardFields: React.FC<FlashcardFieldProps> = ({
  index,
  frontText,
  backText,
  disabled,
  onChange,
  onRemove,
  canRemove,
  autoFocus,
}) => {
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) firstInputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div className="card bg-base-200/60 backdrop-blur border border-base-300/50 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-center gap-4 p-4 pb-2">
        <span className="font-medium">Flashcard {index + 1}</span>
        {canRemove && onRemove && (
          <motion.button
            type="button"
            className="btn btn-sm btn-error"
            onClick={() => onRemove(index)}
            disabled={disabled}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Remove
          </motion.button>
        )}
      </div>

      <div className="p-4 pt-2 space-y-3">
        <input
          ref={firstInputRef}
          type="text"
          className="input input-bordered w-full focus:outline-none focus:ring focus:ring-primary/25"
          placeholder="Front Text"
          value={frontText}
          onChange={(e) => onChange(index, 'frontText', e.target.value)}
          disabled={disabled}
        />
        <input
          type="text"
          className="input input-bordered w-full focus:outline-none focus:ring focus:ring-primary/25"
          placeholder="Back Text"
          value={backText}
          onChange={(e) => onChange(index, 'backText', e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default DeckFlashcardFields;
