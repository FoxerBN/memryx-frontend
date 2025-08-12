import React from 'react';
import DeckFlashcardFields from './DeckFlashcardFields';
import type { FlashcardCreateRequestDto } from '@/type/deckApi';

export interface DeckFormProps {
  deckName: string;
  description: string;
  flashcards: FlashcardCreateRequestDto[];
  isLoading: boolean;
  error: string | null;
  onChangeName: (v: string) => void;
  onChangeDescription: (v: string) => void;
  onAddFlashcard: () => void;
  onRemoveFlashcard: (i: number) => void;
  onChangeFlashcard: (i: number, field: 'frontText' | 'backText', value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
}

// Generic deck form (create/edit)
export const DeckForm: React.FC<DeckFormProps> = ({
  deckName,
  description,
  flashcards,
  isLoading,
  error,
  onChangeName,
  onChangeDescription,
  onAddFlashcard,
  onRemoveFlashcard,
  onChangeFlashcard,
  onSubmit,
  submitLabel,
}) => (
  <form onSubmit={onSubmit} className="space-y-6 relative">
    {error && (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    )}

    <div className="form-control">
      <label className="label"><span className="label-text">Deck Name</span></label>
      <input
        type="text"
        className="input input-bordered w-full"
        value={deckName}
        onChange={(e) => onChangeName(e.target.value)}
        placeholder="Enter deck name"
        disabled={isLoading}
        required
      />
    </div>

    <div className="form-control">
      <label className="label"><span className="label-text">Description (optional)</span></label>
      <textarea
        className="textarea textarea-bordered w-full"
        value={description}
        onChange={(e) => onChangeDescription(e.target.value)}
        placeholder="Enter deck description"
        rows={3}
        disabled={isLoading}
      />
    </div>

    <div className="form-control">
      <div className="sticky top-0 flex justify-between items-center mb-4 bg-base-100/90 backdrop-blur z-10 py-2 border-b border-base-300">
        <label className="label m-0"><span className="label-text font-semibold">Flashcards ({flashcards.length})</span></label>
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={onAddFlashcard}
          disabled={isLoading}
        >Add Flashcard</button>
      </div>

      <div className="space-y-4">
        {flashcards.map((card, idx) => (
          <DeckFlashcardFields
            key={idx}
            index={idx}
            frontText={card.frontText}
            backText={card.backText}
            disabled={isLoading}
            canRemove={flashcards.length > 1}
            onRemove={onRemoveFlashcard}
            onChange={onChangeFlashcard}
          />
        ))}
      </div>
    </div>

    <button
      type="submit"
      className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
      disabled={isLoading || !deckName.trim()}
    >{submitLabel}</button>

    {/* Floating add button (mobile / long lists) */}
    <button
      type="button"
      aria-label="Add flashcard"
      onClick={onAddFlashcard}
      disabled={isLoading}
      className="btn btn-secondary btn-circle fixed bottom-6 right-6 shadow-lg md:hidden"
    >+</button>
  </form>
);

export default DeckForm;
