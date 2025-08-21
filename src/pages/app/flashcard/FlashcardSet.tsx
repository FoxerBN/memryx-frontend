import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Middle from "@/components/ui/flashcard/Middle";
import type { MiddleHandle } from "@/components/ui/flashcard/Middle";
import FlashcardNavigation from "@/components/layout/FlashcardNavigation";
import DockMenu from "@/components/layout/DockMenu";
import { useFlashcardSet } from "@/hooks/useFlashcardSet";
import StudyOptionsModal from "@/components/ui/modal/StudyOptionsModal";
import type { StudyOrder } from "@/interface/studyOptionsModal";

export default function FlashcardSet() {
  const { id } = useParams<{ id: string }>();
  const deckId = parseInt(id || "0", 10);

  const { deck, cards, loading, error } = useFlashcardSet(deckId);

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [orderMode, setOrderMode] = useState<StudyOrder>("original");
  const [shuffleNonce, setShuffleNonce] = useState(0);

  const middleRef = useRef<MiddleHandle>(null);

  const handleToggleSettings = (open: boolean) => setIsOptionsOpen(open);

  const shuffle = <T,>(arr: T[]) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const displayCards = useMemo(() => {
    if (!cards?.length) return [];
    switch (orderMode) {
      case "reverse":
        return [...cards].reverse();
      case "random":

        void shuffleNonce;
        return shuffle(cards);
      case "original":
      default:
        return cards;
    }
  }, [cards, orderMode, shuffleNonce]);

  const applyOrder = (mode: StudyOrder) => {
    setOrderMode(mode);
    if (mode === "random") {
      setShuffleNonce((n) => n + 1);
    }
    // reset whole study state (including still-learning) when user changes order
    middleRef.current?.reset();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-between items-center h-full overflow-hidden">
        <FlashcardNavigation deckName="Loading..." onToggleSettings={handleToggleSettings} />
        <div className="flex items-center justify-center h-full">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
        <DockMenu />
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="flex flex-col justify-between items-center h-full overflow-hidden">
        <FlashcardNavigation deckName="Error" onToggleSettings={handleToggleSettings} />
        <div className="flex items-center justify-center h-full">
          <div className="text-error">Failed to load deck</div>
        </div>
        <DockMenu />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-center h-full overflow-hidden">
      <FlashcardNavigation
        deckName={deck.name}
        settingsOpen={isOptionsOpen}
        onToggleSettings={setIsOptionsOpen}
      />

      <Middle ref={middleRef} cards={displayCards} />
      <DockMenu />

      <StudyOptionsModal
        open={isOptionsOpen}
        current={orderMode}
        onClose={() => setIsOptionsOpen(false)}
        onSelect={applyOrder}
      />
    </div>
  );
}
