import { useCallback, useState } from 'react';
import type { UseDeckFormOptions } from '@/interface/deckFormOptions';
import type { DeckCreateRequestDto, FlashcardCreateRequestDto } from '@/type/deckApi';

export function useDeckForm({
  initialName = '',
  initialDescription = '',
  initialFlashcards = [{ frontText: '', backText: '' }],
  onSubmitDeck,
  folderId,
  isEdit = false,
}: UseDeckFormOptions) {
  const [deckName, setDeckName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [flashcards, setFlashcards] = useState<FlashcardCreateRequestDto[]>(initialFlashcards);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFlashcard = useCallback(() => {
    setFlashcards(prev => [...prev, { frontText: '', backText: '' }]);
    const delay = 350;
    setTimeout(() => {
      const el = document.scrollingElement || document.documentElement || document.body;
      const bottom = el.scrollHeight;
      window.scrollTo({ top: bottom, behavior: 'smooth' });
    }, delay);
  }, []);


  const removeFlashcard = useCallback((index: number) => {
    setFlashcards(prev => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev);
  }, []);

  const updateFlashcard = useCallback((index: number, field: 'frontText' | 'backText', value: string) => {
    setFlashcards(prev => prev.map((card, i) => i === index ? { ...card, [field]: value } : card));
  }, []);

  const submit = useCallback(async () => {
    const validFlashcards = flashcards.filter(f => f.frontText.trim() && f.backText.trim());
    if (validFlashcards.length === 0) {
      setError('At least one flashcard with both front and back text is required');
      return false;
    }
    setIsLoading(true);
    setError(null);
    try {
      const base: Partial<DeckCreateRequestDto> = {
        name: deckName.trim(),
        description: description.trim(),
        flashcards: validFlashcards,
      };
      const payload: DeckCreateRequestDto | Partial<DeckCreateRequestDto> = !isEdit
        ? { ...base, folderId: folderId! } as DeckCreateRequestDto
        : { ...base, ...(folderId ? { folderId } : {}) };

      const ok = await onSubmitDeck(payload);
      if (!ok) setError('Operation failed');
      return ok;
    } catch {
      setError('Operation failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [deckName, description, flashcards, folderId, isEdit, onSubmitDeck]);

  return {
    deckName,
    description,
    flashcards,
    isLoading,
    error,
    setDeckName,
    setDescription,
    setFlashcards,
    addFlashcard,
    removeFlashcard,
    updateFlashcard,
    submit,
  };
}
