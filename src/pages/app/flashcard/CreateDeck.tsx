import { useParams, useNavigate } from 'react-router-dom';
import { useDecks } from '@/hooks/useDeck';
import FolderNavigation from '@/components/layout/FolderNavigation';
import DeckForm from '@/components/ui/deck/DeckForm';
import { useDeckForm } from '@/hooks/useDeckForm';
import type { DeckCreateRequestDto } from '@/type/deckApi';

export default function CreateDeck() {
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId: string }>();
  const folderIdNum = folderId ? Number(folderId) : null;
  const { create } = useDecks(folderIdNum);

  const form = useDeckForm({
    folderId: folderIdNum || undefined,
    onSubmitDeck: async (data) => {
      if (!folderIdNum) return false;
      // ensure full payload
      const payload: DeckCreateRequestDto = {
        folderId: folderIdNum,
        name: (data as DeckCreateRequestDto).name || '',
        description: (data as DeckCreateRequestDto).description || '',
        flashcards: (data as DeckCreateRequestDto).flashcards || [],
      };
      const created = await create(payload);
      if (created) navigate(`/folder/${folderIdNum}`);
      return !!created;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <FolderNavigation onBack={() => navigate(-1)} onAdd={() => {}} username="guest" />
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-center mb-8">Create Deck</h1>
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
            submitLabel="Create Deck"
          />
        </div>
      </div>
    </div>
  );
}