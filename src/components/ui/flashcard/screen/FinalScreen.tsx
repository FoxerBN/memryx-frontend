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
  const getPerformanceState = () => {
    if (total === 0) return { message: "No cards to practice!", emoji: "🤔", color: "text-base-content" };
    
    const percentage = (known / total) * 100;
    
    if (percentage >= 80) {
      return {
        message: "You are the best! Excellent work! 🌟",
        emoji: "🎉",
        color: "text-success"
      };
    } else if (percentage >= 50) {
      return {
        message: "Pretty good! Keep trying, you're making progress! 💪",
        emoji: "👍",
        color: "text-info"
      };
    } else if (percentage >= 30) {
      return {
        message: "Keep learning and be better! You're on the right track! 📚",
        emoji: "💡",
        color: "text-warning"
      };
    } else {
      return {
        message: "Try it again and focus more! Practice makes perfect! 🎯",
        emoji: "🔥",
        color: "text-error"
      };
    }
  };

  const performanceState = getPerformanceState();
  const percentage = total > 0 ? Math.round((known / total) * 100) : 0;

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
          <div className="text-lg font-semibold mb-2">Session Complete!</div>
          <div className="text-2xl mb-2">{performanceState.emoji}</div>
          <div className={`text-base font-medium mb-4 ${performanceState.color}`}>
            {performanceState.message}
          </div>
          <div className="text-sm opacity-70 mb-2">
            You got {known} out of {total} cards correct ({percentage}%)
          </div>
          {stillLearningCardsCount > 0 && (
            <div className="text-sm opacity-70">
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