import React, { useMemo} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { easeOut } from 'motion';
import DeckFlashcardFields from './DeckFlashcardFields';
import type { DeckFormProps } from '@/interface/deckFormProps';



const fadeInUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.28, ease: easeOut },
};

const listTransition = { duration: 0.22, ease: easeOut };

const DeckForm: React.FC<DeckFormProps> = ({
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
}) => {


  // Memo for keying last index for autofocus
  const lastIndex = useMemo(() => Math.max(0, flashcards.length - 1), [flashcards.length]);

  return (
    <motion.form onSubmit={onSubmit} className="space-y-6 relative" {...fadeInUp}>
      {/* Loading veil */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-base-100/60 backdrop-blur-sm z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-base-200/60 via-base-100/20 to-base-200/60" />
        </motion.div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div className="alert alert-error shadow-sm" {...fadeInUp} key="form-error">
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="form-control">
        <label className="label"><span className="label-text">Deck Name</span></label>
        <input
          type="text"
          className="input input-bordered w-full focus:outline-none focus:ring focus:ring-primary/30"
          value={deckName}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Enter deck name"
          disabled={isLoading}
          required
        />
      </motion.div>

      <motion.div layout className="form-control">
        <label className="label"><span className="label-text">Description (optional)</span></label>
        <textarea
          className="textarea textarea-bordered w-full focus:outline-none focus:ring focus:ring-primary/30"
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
          placeholder="Enter deck description"
          rows={3}
          disabled={isLoading}
        />
      </motion.div>

      <div className="form-control">
        <div className="sticky -top-px flex justify-between items-center mb-4 bg-base-100/80 backdrop-blur z-10 py-2 border-b border-base-300/60">
          <label className="label m-0"><span className="label-text font-semibold">Flashcards ({flashcards.length})</span></label>
          <motion.button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={onAddFlashcard}
            disabled={isLoading}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add Flashcard
          </motion.button>
        </div>

        <AnimatePresence initial={false}>
          <motion.div layout className="space-y-4">
            {flashcards.map((card, idx) => (
              <motion.div
                key={`${idx}-${card.frontText?.slice(0, 2) ?? ''}-${card.backText?.slice(0, 2) ?? ''}`}
                layout
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={listTransition}
              >
                <DeckFlashcardFields
                  index={idx}
                  frontText={card.frontText}
                  backText={card.backText}
                  disabled={isLoading}
                  canRemove={flashcards.length > 1}
                  onRemove={onRemoveFlashcard}
                  onChange={onChangeFlashcard}
                  autoFocus={idx === lastIndex}
                />
              </motion.div>
            ))}
            <div />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.button
        type="submit"
        className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
        disabled={isLoading || !deckName.trim()}
        whileHover={!isLoading ? { y: -2 } : undefined}
        whileTap={!isLoading ? { scale: 0.98 } : undefined}
      >
        {submitLabel}
      </motion.button>

      {/* Floating add button (mobile / long lists) */}
      <motion.button
        type="button"
        aria-label="Add flashcard"
        onClick={onAddFlashcard}
        disabled={isLoading}
        className="btn btn-secondary btn-circle fixed bottom-6 right-6 shadow-lg md:hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        +
      </motion.button>
    </motion.form>
  );
};

export default DeckForm;