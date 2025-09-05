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
import FinalScreen from "@/components/ui/flashcard/screen/FinalScreen";
import NoCardsScreen from "@/components/ui/flashcard/screen/NoCardScreen";
import { useStillLearningSession } from "@/hooks/useStillLearningSession";
import { useFlashcardNavigation } from "@/hooks/useFlashcardNavigation";
import { IoArrowBack } from "react-icons/io5";
import { RiResetLeftLine } from "react-icons/ri";
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
    const [originalCards, setOriginalCards] = useState<Card[]>([]);

    // Initialize original cards
    useEffect(() => {
      if (originalCards.length === 0) {
        setOriginalCards(cards);
      }
    }, [cards, originalCards.length]);

    // Use the still learning session hook
    const {
      isStillLearningMode,
      stillLearningCards,
      stillLearningSessionCards,
      stillLearningSessionTotal,
      addToStillLearning,
      removeFromStillLearning,
      startStillLearningSession: startStillLearningSessionHook,
      resetStillLearningState,
    } = useStillLearningSession(originalCards);

    // Current cards to display (snapshot v still-learning mode)
    const currentCards = isStillLearningMode ? stillLearningSessionCards : cards;

    // Total for progress bar - fixed during still learning session
    const progressTotal = isStillLearningMode
      ? stillLearningSessionTotal
      : currentCards.length;

    // Use the flashcard navigation hook
    const {
      index,
      known,
      learning,
      isFlipped,
      dragActive,
      showFinalScreen,
      current,
      setIsFlipped,
      reset,
      restartForCurrentCards,
      handleDragStart,
      handleDragEnd,
      previousCard,
    } = useFlashcardNavigation({
      currentCards,
      isStillLearningMode,
      addToStillLearning,
      removeFromStillLearning,
      resetStillLearningState,
      onCountChange,
      startIndex,
    });

    const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 12 } })
    );

    const startStillLearningSession = () => {
      // Start still learning session via hook, then restart navigation state without clearing SL set
      startStillLearningSessionHook();
      restartForCurrentCards();
    };

    useImperativeHandle(ref, () => ({ reset }), [reset]);

    // Simple helper + component: ensure consistent responsive font sizing based on text length
    // This prevents font-size jumps between the card and the drag overlay and keeps long text readable.
    const getText = (node: React.ReactNode) =>
      typeof node === "string" ? node : node == null ? "" : String(node);

    const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      const txt = getText(children).trim();
      const len = txt.length;
      const fontSize =
        len > 150
          ? "clamp(0.9rem, 2.4vw, 1.05rem)"
          : "clamp(1.55rem, 4vw, 2rem)"; 

      return (
        <div
          className="text-center break-words hyphens-auto w-full"
          style={{ fontSize, lineHeight: 1.3 }}
        >
          {children}
        </div>
      );
    };

    // Final screen when all cards are done
    if (showFinalScreen || (!current && index >= currentCards.length)) {
      return (
        <FinalScreen
          known={known}
          learning={learning}
          total={progressTotal}
          isStillLearningMode={isStillLearningMode}
          stillLearningCardsCount={stillLearningCards.size}
          onReset={reset}
          onStartStillLearning={startStillLearningSession}
        />
      );
    }

    if (!current) {
      return <NoCardsScreen />;
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
              front: <CardContent>{current.front}</CardContent>,
              back: <CardContent>{current.back}</CardContent>,
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
                      <CardContent>{current.front}</CardContent>
                    </InnerSurface>
                  </div>
                  <div className="card-face card-back">
                    <InnerSurface>
                      <CardContent>{current.back}</CardContent>
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
          .break-words { word-break: break-word; }
          .hyphens-auto { hyphens: auto; }
        `}</style>

        <div className="flex w-full flex-row justify-around items-center mt-7">
          <button
            onClick={previousCard}
            disabled={index === 0}
            className="btn btn-ghost btn-sm"
          >
            <IoArrowBack size={26} />
          </button>
          <button className="btn btn-sm btn-ghost" onClick={reset}>
            <RiResetLeftLine size={26} />
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
