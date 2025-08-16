import React, {
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
} from "@dnd-kit/core";
import FlashcardProgress from "@/components/ui/flashcard/FlashcardProgress";
import type { DragEndEvent } from "@dnd-kit/core/dist/types";

type Card = {
  id: string | number;
  front: React.ReactNode;
  back: React.ReactNode;
};

export interface MiddleHandle {
  reset: () => void;
}

interface FlashcardSetProps {
  cards: Card[];
  startIndex?: number;
  onCountChange?: (stats: {
    known: number;
    learning: number;
    index: number;
  }) => void;
}

const Middle = forwardRef<MiddleHandle, FlashcardSetProps>(
  ({ cards, startIndex = 0, onCountChange }, ref) => {
    const [index, setIndex] = useState(startIndex);
    const [known, setKnown] = useState(0);
    const [learning, setLearning] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Track which cards are marked as still learning
    const [stillLearningCards, setStillLearningCards] = useState<
      Set<string | number>
    >(new Set());

    // Track card history for proper back navigation
    const [cardHistory, setCardHistory] = useState<
      Array<{
        cardId: string | number;
        category: "known" | "learning" | "none";
      }>
    >([]);

    const [showFinalScreen, setShowFinalScreen] = useState(false);

    // Still learning mode
    const [isStillLearningMode, setIsStillLearningMode] = useState(false);
    const [originalCards, setOriginalCards] = useState<Card[]>([]);

    // Snapshot kariet pre jednu still-learning session (stabilné počas session)
    const [stillLearningSessionCards, setStillLearningSessionCards] = useState<
      Card[]
    >([]);
    const [stillLearningSessionTotal, setStillLearningSessionTotal] =
      useState(0);

    // Initialize original cards
    useEffect(() => {
      if (originalCards.length === 0) {
        setOriginalCards(cards);
      }
    }, [cards, originalCards.length]);

    // Current cards to display (snapshot v still-learning mode)
    const currentCards = isStillLearningMode ? stillLearningSessionCards : cards;

    // Total for progress bar - fixed during still learning session
    const progressTotal = isStillLearningMode
      ? stillLearningSessionTotal
      : currentCards.length;

    const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 12 } })
    );

    const current = currentCards[index];

    const reset = () => {
      setIsStillLearningMode(false);
      setIndex(0);
      setKnown(0);
      setLearning(0);
      setIsFlipped(false);
      setDragActive(false);
      setStillLearningCards(new Set());
      setCardHistory([]);
      setShowFinalScreen(false);
      setStillLearningSessionCards([]);
      setStillLearningSessionTotal(0);
    };

    const startStillLearningSession = () => {
      // Switch to still learning mode a vytvor snapshot
      setIsStillLearningMode(true);
      setIndex(0);
      setKnown(0);
      setLearning(0);
      setIsFlipped(false);
      setCardHistory([]);
      setShowFinalScreen(false);

      const session = originalCards.filter((card) =>
        stillLearningCards.has(card.id)
      );
      setStillLearningSessionCards(session);
      setStillLearningSessionTotal(session.length);
    };

    useImperativeHandle(ref, () => ({ reset }), []);

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
          // Decrement known count
          setKnown((k) => Math.max(k - 1, 0));

          // V still-learning mode kartu vrátime späť do setu (snapshot sa tým nemení)
          if (isStillLearningMode) {
            setStillLearningCards((prev) => new Set([...prev, lastEntry.cardId]));
          }
        } else if (lastEntry.category === "learning") {
          // Decrement learning count
          setLearning((l) => Math.max(l - 1, 0));

          // Len v normálnom režime odoberáme zo stillLearningCards
          if (!isStillLearningMode) {
            setStillLearningCards((prev) => {
              const newSet = new Set(prev);
              newSet.delete(lastEntry.cardId);
              return newSet;
            });
          }
        }

        // Remove last entry from history
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

        // DÔLEŽITÉ: Aj v still-learning mode vyhoď kartu zo setu,
        // aby ďalšia session obsahovala už len tie, čo zostali
        setStillLearningCards((prev) => {
          const newSet = new Set(prev);
          newSet.delete(current.id);
          return newSet;
        });

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

        // Do setu pridávame len v normálnom režime.
        // V still-learning mode tam už karta je; ak by si sa k nej vrátila „Backom“
        // zo stavu known, previousCard ju do setu opäť pridá.
        if (!isStillLearningMode) {
          setStillLearningCards((prev) => new Set([...prev, current.id]));
        }

        setCardHistory((prev) => [
          ...prev,
          { cardId: current.id, category: "learning" },
        ]);
        nextCard();
        return;
      }
    };

    const handleResetClick = () => {
      reset();
    };

    // Final screen when all cards are done
    if (showFinalScreen || (!current && index >= currentCards.length)) {
      return (
        <div className="w-full h-full grid place-items-center px-4">
          <div className="flex flex-col items-center gap-4">
            <FlashcardProgress
              known={known}
              learning={learning}
              index={progressTotal}
              total={progressTotal}
            />
            <div className="bg-base-100 border rounded-2xl shadow p-8 text-center">
              <div className="text-lg font-semibold mb-4">Session Complete!</div>
              {stillLearningCards.size > 0 && (
                <div className="text-sm opacity-70 mb-4">
                  You have {stillLearningCards.size} cards marked for review
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={reset}>
                {isStillLearningMode ? "Back to All Cards" : "Restart All Cards"}
              </button>
              {stillLearningCards.size > 0 && (
                <button
                  className="btn btn-primary"
                  onClick={startStillLearningSession}
                >
                  Practice Still Learning ({stillLearningCards.size})
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (!current) {
      return (
        <div className="w-full h-full grid place-items-center px-4">
          <div className="text-lg">No cards available</div>
        </div>
      );
    }

    return (
      <div className="w-full h-full grid place-items-center px-4">
        <FlashcardProgress
          known={known}
          learning={learning}
          index={index}
          total={progressTotal}
          className="mb-3"
        />

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <FlipDraggableCard
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped((f) => !f)}
            draggableId={`card-${current.id}`}
          >
            {{
              front: (
                <div className="text-3xl text-center">{current.front}</div>
              ),
              back: <div className="text-3xl text-center">{current.back}</div>,
            }}
          </FlipDraggableCard>

          <DragOverlay>
            {dragActive ? (
              <CardFrame>
                <div
                  className={`card-inner card-lg ${
                    isFlipped ? "card-flipped" : ""
                  }`}
                >
                  <div className="card-face card-front">
                    <InnerSurface>
                      <div className="text-3xl text-center">
                        {current.front}
                      </div>
                    </InnerSurface>
                  </div>
                  <div className="card-face card-back">
                    <InnerSurface>
                      <div className="text-3xl text-center">{current.back}</div>
                    </InnerSurface>
                  </div>
                </div>
              </CardFrame>
            ) : null}
          </DragOverlay>
        </DndContext>

        <style>{`
          .card-3d { perspective: 1000px; position: relative; }
          .card-inner { position: relative; transform-style: preserve-3d; transition: transform 0.6s; }
          .card-lg { width: min(70vw, 44rem); height: min(80vh, 55vh); }
          .card-flipped { transform: rotateY(180deg); }
          .card-face { position: absolute; inset: 0; backface-visibility: hidden; display:flex; align-items:center; justify-content:center; }
          .card-back { transform: rotateY(180deg); }
        `}</style>

        <div className="flex w-full flex-row justify-evenly items-center mt-7">
          <button
            onClick={previousCard}
            disabled={index === 0}
            className="btn btn-ghost btn-sm"
          >
            ← Back
          </button>
          <button className="btn btn-sm btn-neutral" onClick={handleResetClick}>
            Reset
          </button>
        </div>
      </div>
    );
  }
);

Middle.displayName = "Middle";

/* ----------------- Helper Components ----------------- */

const InnerSurface: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="bg-base-100 border rounded-2xl shadow w-full h-full p-10 flex items-center justify-center">
    {children}
  </div>
);

const CardFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="card-3d">{children}</div>
);

const FlipDraggableCard: React.FC<{
  isFlipped: boolean;
  onFlip: () => void;
  draggableId: string;
  children: { front: React.ReactNode; back: React.ReactNode };
}> = ({ isFlipped, onFlip, draggableId, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: draggableId,
    });

  const style: React.CSSProperties = useMemo(
    () => ({
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      cursor: isDragging ? "grabbing" : "grab",
      touchAction: "none",
    }),
    [transform, isDragging]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="card-3d select-none"
      onClick={() => !isDragging && onFlip()}
    >
      <div className={`card-inner card-lg ${isFlipped ? "card-flipped" : ""}`}>
        <div className="card-face card-front">
          <InnerSurface>{children.front}</InnerSurface>
        </div>
        <div className="card-face card-back">
          <InnerSurface>{children.back}</InnerSurface>
        </div>
      </div>
    </div>
  );
};

export default Middle;
