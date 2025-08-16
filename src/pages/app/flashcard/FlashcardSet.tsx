import { useParams } from "react-router-dom";
import Middle from "@/components/ui/flashcard/Middle";
import FlashcardNavigation from "@/components/layout/FlashcardNavigation";
import DockMenu from "@/components/layout/DockMenu";
import { useFlashcardSet } from "@/hooks/useFlashcardSet";

export default function FlashcardSet() {
  const { id } = useParams<{ id: string }>();
  const deckId = parseInt(id || "0", 10);
  
  const { deck, cards, loading, error } = useFlashcardSet(deckId);

  if (loading) {
    return (
      <div className="flex flex-col justify-between items-center h-full overflow-hidden">
        <FlashcardNavigation deckName="Loading..." />
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
        <FlashcardNavigation deckName="Error" />
        <div className="flex items-center justify-center h-full">
          <div className="text-error">Failed to load deck</div>
        </div>
        <DockMenu />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-center h-full overflow-hidden">
      <FlashcardNavigation deckName={deck.name} />
      <Middle cards={cards} />
      <DockMenu />
    </div>
  );
}