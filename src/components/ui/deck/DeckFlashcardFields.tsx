import React from 'react';

export interface FlashcardFieldProps {
  index: number;
  frontText: string;
  backText: string;
  disabled?: boolean;
  onChange: (index: number, field: 'frontText' | 'backText', value: string) => void;
  onRemove?: (index: number) => void;
  canRemove: boolean;
}

// Single flashcard input group
export const DeckFlashcardFields: React.FC<FlashcardFieldProps> = ({
  index,
  frontText,
  backText,
  disabled,
  onChange,
  onRemove,
  canRemove,
}) => (
  <div className="card bg-base-200 p-4">
    <div className="flex justify-between items-center mb-3">
      <span className="font-medium">Flashcard {index + 1}</span>
      {canRemove && onRemove && (
        <button
          type="button"
          className="btn btn-sm btn-error"
          onClick={() => onRemove(index)}
          disabled={disabled}
        >
          Remove
        </button>
      )}
    </div>

    <div className="space-y-3">
      <input
        type="text"
        className="input input-bordered w-full"
        placeholder="Front Text"
        value={frontText}
        onChange={(e) => onChange(index, 'frontText', e.target.value)}
        disabled={disabled}
      />
      <input
        type="text"
        className="input input-bordered w-full"
        placeholder="Back Text"
        value={backText}
        onChange={(e) => onChange(index, 'backText', e.target.value)}
        disabled={disabled}
      />
    </div>
  </div>
);

export default DeckFlashcardFields;
