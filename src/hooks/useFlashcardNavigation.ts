import { useState, useCallback } from "react";
import type { DragEndEvent } from "@dnd-kit/core/dist/types";

type Card = {
  id: string | number;
  front: React.ReactNode;
  back: React.ReactNode;
};

type CardHistory = {
  cardId: string | number;
  category: "known" | "learning" | "none";
};

interface UseFlashcardNavigationProps {
  currentCards: Card[];
  isStillLearningMode: boolean;
  addToStillLearning: (cardId: string | number) => void;
  removeFromStillLearning: (cardId: string | number) => void;
  resetStillLearningState: () => void;
  onCountChange?: (stats: { known: number; learning: number; index: number }) => void;
  startIndex?: number;
}

export function useFlashcardNavigation({
  currentCards,
  isStillLearningMode,
  addToStillLearning,
  removeFromStillLearning,
  resetStillLearningState,
  onCountChange,
  startIndex = 0,
}: UseFlashcardNavigationProps) {
  const [index, setIndex] = useState(startIndex);
  const [known, setKnown] = useState(0);
  const [learning, setLearning] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [cardHistory, setCardHistory] = useState<CardHistory[]>([]);

  const current = currentCards[index];

  const reset = useCallback(() => {
    setIndex(0);
    setKnown(0);
    setLearning(0);
    setIsFlipped(false);
    setDragActive(false);
    setCardHistory([]);
    setShowFinalScreen(false);
    resetStillLearningState();
    onCountChange?.({ known: 0, learning: 0, index: 0 });
  }, [resetStillLearningState, onCountChange]);

  // New: soft restart without touching still learning state
  const restartForCurrentCards = useCallback(() => {
    setIndex(0);
    setKnown(0);
    setLearning(0);
    setIsFlipped(false);
    setDragActive(false);
    setCardHistory([]);
    setShowFinalScreen(false);
    onCountChange?.({ known: 0, learning: 0, index: 0 });
  }, [onCountChange]);

  const handleDragStart = () => setDragActive(true);

  const nextCard = () => {
    setIsFlipped(false);
    setIndex((prev) => {
      const nextIndex = Math.min(prev + 1, currentCards.length);
      if (nextIndex >= currentCards.length) {
        setShowFinalScreen(true);
      }
      return nextIndex;
    });
  };

  const previousCard = () => {
    if (index === 0) return;

    setIsFlipped(false);
    setIndex((prev) => Math.max(prev - 1, 0));

    if (cardHistory.length > 0) {
      const lastEntry = cardHistory[cardHistory.length - 1];

      if (lastEntry.category === "known") {
        setKnown((k) => Math.max(k - 1, 0));
        if (isStillLearningMode) {
          addToStillLearning(lastEntry.cardId);
        }
      } else if (lastEntry.category === "learning") {
        setLearning((l) => Math.max(l - 1, 0));
        if (!isStillLearningMode) {
          removeFromStillLearning(lastEntry.cardId);
        }
      }

      setCardHistory((prev) => prev.slice(0, -1));
    }

    setShowFinalScreen(false);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setDragActive(false);

    const translated = e.active.rect.current.translated;
    if (!translated || !current) return;

    const { width, left, right } = translated;
    const vw = window.innerWidth;

    const oneThird = width / 3;
    const crossesRight = left >= vw - oneThird;
    const crossesLeft = right <= oneThird;

    if (crossesRight) {
      // Mark as known
      setKnown((k) => {
        const next = k + 1;
        onCountChange?.({ known: next, learning, index });
        return next;
      });
      
      removeFromStillLearning(current.id);

      setCardHistory((prev) => [
        ...prev,
        { cardId: current.id, category: "known" },
      ]);
      nextCard();
      return;
    }

    if (crossesLeft) {
      // Mark as still learning
      setLearning((l) => {
        const next = l + 1;
        onCountChange?.({ known, learning: next, index });
        return next;
      });

      if (!isStillLearningMode) {
        addToStillLearning(current.id);
      }

      setCardHistory((prev) => [
        ...prev,
        { cardId: current.id, category: "learning" },
      ]);
      nextCard();
      return;
    }
  };

  return {
    // State
    index,
    known,
    learning,
    isFlipped,
    dragActive,
    showFinalScreen,
    current,
    
    // Actions
    setIsFlipped,
    reset,
    restartForCurrentCards,
    handleDragStart,
    handleDragEnd,
    nextCard,
    previousCard,
  };
}
