
export interface FlashcardNavigationProps {
  deckName?: string;
  onBackClick?: () => void;
  onToggleSettings?: (open: boolean) => void;
}