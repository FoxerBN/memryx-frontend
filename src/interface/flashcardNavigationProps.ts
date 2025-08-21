export interface FlashcardNavigationProps {
  deckName?: string;
  onBackClick?: () => void;
  settingsOpen?: boolean;
  onToggleSettings?: (open: boolean) => void;
}
