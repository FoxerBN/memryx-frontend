import type { FlashcardCreateRequestDto } from '@/type/deckApi';

export interface DeckFormProps {
  deckName: string;
  description: string;
  flashcards: FlashcardCreateRequestDto[];
  isLoading: boolean;
  error: string | null;
  onChangeName: (v: string) => void;
  onChangeDescription: (v: string) => void;
  onAddFlashcard: () => void;
  onRemoveFlashcard: (i: number) => void;
  onChangeFlashcard: (
    i: number,
    field: 'frontText' | 'backText',
    value: string
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
}