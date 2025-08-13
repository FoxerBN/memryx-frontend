import React, {
  useMemo,
  useState,
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

    const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 12 } })
    );

    const current = cards[index];

    const reset = () => {
      setIndex(0);
      setKnown(0);
      setLearning(0);
      setIsFlipped(false);
      setDragActive(false);
    };

    useImperativeHandle(ref, () => ({ reset }), []);

    const handleDragStart = () => setDragActive(true);

    const handleDragEnd = (e: DragEndEvent) => {
      setDragActive(false);

      const translated = e.active.rect.current.translated;
      if (!translated) return;

      const { width, left, right } = translated;
      const vw = window.innerWidth;

      // Zaráta sa až keď je aspoň 1/3 šírky karty mimo okraj viewportu
      const oneThird = width / 3;
      const crossesRight = left >= vw - oneThird;
      const crossesLeft = right <= oneThird;

      if (crossesRight) {
        setKnown((k) => {
          const next = k + 1;
          onCountChange?.({ known: next, learning, index });
          return next;
        });
        nextCard();
        return;
      }

      if (crossesLeft) {
        setLearning((l) => {
          const next = l + 1;
          onCountChange?.({ known, learning: next, index });
          return next;
        });
        nextCard();
        return;
      }
      // inak sa karta vráti (dnd-kit vynuluje transform)
    };

    const nextCard = () => {
      setIsFlipped(false);
      setIndex((i) => Math.min(i + 1, cards.length));
    };

    // ---------- Empty state (po dobehnutí balíka) ----------
    if (!current) {
      return (
        <div className="w-full h-full grid place-items-center px-4">
          <div className="flex flex-col items-center gap-4">
            <FlashcardProgress
              known={known}
              learning={learning}
              index={cards.length} // <- toto
              total={cards.length}
            />
            <div className="bg-base-100 border rounded-2xl shadow p-8">
              <div className="text-lg font-semibold">Complete</div>
            </div>
            <button className="btn btn-outline" onClick={reset}>
              Restart
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full grid place-items-center px-4">
        {/* --- nahrádza starý progress + counter --- */}
        <FlashcardProgress
          known={known}
          learning={learning}
          index={index} // 0-based, začína 0/total = 0 %
          total={cards.length}
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

        {/* Flip 3D CSS – bez farieb, veľká karta */}
        <style>{`
          .card-3d { perspective: 1000px; position: relative; }
          .card-inner { position: relative; transform-style: preserve-3d; transition: transform 0.6s; }
          .card-lg { width: min(70vw, 44rem); height: min(52vh, 28rem); }
          .card-flipped { transform: rotateY(180deg); }
          .card-face { position: absolute; inset: 0; backface-visibility: hidden; display:flex; align-items:center; justify-content:center; }
          .card-back { transform: rotateY(180deg); }
        `}</style>
        <button className="btn btn-sm btn-neutral mt-7" onClick={reset}>
          Restart
        </button>
      </div>
    );
  }
);

Middle.displayName = "Middle";

/* ----------------- Pomocné komponenty ----------------- */

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
