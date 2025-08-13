import type { DeckCreateRequestDto, FlashcardCreateRequestDto } from '@/type/deckApi';
export interface UseDeckFormOptions {
  initialName?: string;
  initialDescription?: string;
  initialFlashcards?: FlashcardCreateRequestDto[];
  onSubmitDeck: (data: DeckCreateRequestDto | Partial<DeckCreateRequestDto>) => Promise<boolean> | boolean;
  folderId?: number;
  isEdit?: boolean;
}