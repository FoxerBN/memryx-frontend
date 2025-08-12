import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FolderNavigation from "@/components/layout/FolderNavigation";
import { getDeck } from "@/utils/api";
import { useDecks } from "@/hooks/useDeck";
import { useDeckForm } from "@/hooks/useDeckForm";
import type { DeckDto, DeckCreateRequestDto } from "@/type/deckApi";
import DeckForm from "@/components/ui/deck/DeckForm";

export default function EditDeck() {
  const navigate = useNavigate();
  const { deckId } = useParams<{ deckId: string }>();
  const deckIdNum = deckId ? Number(deckId) : null;
  const [deck, setDeck] = useState<DeckDto | null>(null);
  const [loadingDeck, setLoadingDeck] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const form = useDeckForm({
    initialName: '',
    initialDescription: '',
    initialFlashcards: [{ frontText: '', backText: '' }],
    isEdit: true,
    onSubmitDeck: async (data: Partial<DeckCreateRequestDto>) => {
      if (!deckIdNum || !deck) return false;
      const result = await update(deckIdNum, { ...data, folderId: deck.folderId });
      if (result) navigate(`/folder/${deck.folderId}`);
      return !!result;
    }
  });

  const { update } = useDecks(deck?.folderId || null);

  useEffect(() => {
    (async () => {
      if (!deckIdNum) return;
      try {
        const res = await getDeck(deckIdNum);
        setDeck(res.data);
        form.setDeckName(res.data.name);
        form.setDescription(res.data.description);
        form.setFlashcards(res.data.flashcards.map(f => ({ frontText: f.frontText, backText: f.backText })));
      } catch {
        setLoadError("Failed to load deck data");
      } finally {
        setLoadingDeck(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckIdNum]);

  if (loadingDeck) {
    return (
      <div className="min-h-screen flex flex-col">
        <FolderNavigation onBack={() => navigate(-1)} onAdd={() => {}} username="guest" />
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (loadError && !deck) {
    return (
      <div className="min-h-screen flex flex-col">
        <FolderNavigation onBack={() => navigate(-1)} onAdd={() => {}} username="guest" />
        <div className="flex-1 flex items-center justify-center">
          <div className="alert alert-error"><span>{loadError}</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <FolderNavigation onBack={() => navigate(`/folder/${deck?.folderId}`)} onAdd={() => {}} username="guest" />
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-center mb-8">Edit Deck</h1>
          <DeckForm
            deckName={form.deckName}
            description={form.description}
            flashcards={form.flashcards}
            isLoading={form.isLoading}
            error={form.error}
            onChangeName={form.setDeckName}
            onChangeDescription={form.setDescription}
            onAddFlashcard={form.addFlashcard}
            onRemoveFlashcard={form.removeFlashcard}
            onChangeFlashcard={form.updateFlashcard}
            onSubmit={async (e) => { e.preventDefault(); await form.submit(); }}
            submitLabel="Update Deck"
          />
        </div>
      </div>
    </div>
  );
}