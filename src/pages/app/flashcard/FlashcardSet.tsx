import Middle from "@/components/ui/flashcard/Middle";
import FlashcardNavigation from "@/components/layout/FlashcardNavigation";
import DockMenu from "@/components/layout/DockMenu";
const cards = [
  { id: 1, front: "consult", back: "konzultovať" },
  { id: 2, front: "approach", back: "prístup" },
];
export default function FlashcardSet() {
  return (
    <div className="flex flex-col justify-between items-center h-full overflow-hidden">
      <FlashcardNavigation deckName="set1"/>
      <Middle cards={cards} />

      <DockMenu />
    </div>
  );
}
