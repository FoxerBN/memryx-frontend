import FlashcardProgress from "@/components/ui/flashcard/FlashcardProgress";

interface FinalScreenProps {
  known: number;
  learning: number;
  total: number;
  isStillLearningMode: boolean;
  stillLearningCardsCount: number;
  onReset: () => void;
  onStartStillLearning: () => void;
}

export default function FinalScreen({
  known,
  learning,
  total,
  isStillLearningMode,
  stillLearningCardsCount,
  onReset,
  onStartStillLearning,
}: FinalScreenProps) {
  return (
    <div className="w-full h-full grid place-items-center px-4">
      <div className="flex flex-col items-center gap-4">
        <FlashcardProgress
          known={known}
          learning={learning}
          index={total}
          total={total}
        />
        <div className="bg-base-100 border rounded-2xl shadow p-8 text-center">
          <div className="text-lg font-semibold mb-4">Session Complete!</div>
          {stillLearningCardsCount > 0 && (
            <div className="text-sm opacity-70 mb-4">
              You have {stillLearningCardsCount} cards marked for review
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={onReset}>
            {isStillLearningMode ? "Back to All Cards" : "Restart All Cards"}
          </button>
          {stillLearningCardsCount > 0 && (
            <button className="btn btn-primary" onClick={onStartStillLearning}>
              Practice Still Learning ({stillLearningCardsCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}