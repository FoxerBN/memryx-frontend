import { useState, useEffect } from "react";
import { getDeck } from "@/utils/api";
import type { DeckDto, FlashcardDto } from "@/type/deckApi";

type Card = {
  id: number;
  front: string;
  back: string;
};

export const useFlashcardSet = (deckId: number) => {
  const [deck, setDeck] = useState<DeckDto | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDeck(deckId);
        const deckData = response.data;
        
        setDeck(deckData);
        
        // Transform flashcards to cards format
        const transformedCards: Card[] = deckData.flashcards.map((flashcard: FlashcardDto) => ({
          id: flashcard.id,
          front: flashcard.frontText,
          back: flashcard.backText,
        }));
        
        setCards(transformedCards);
      } catch (err) {
        setError("Failed to fetch deck");
        console.error("Error fetching deck:", err);
      } finally {
        setLoading(false);
      }
    };

    if (deckId) {
      fetchDeck();
    }
  }, [deckId]);

  const refetch = () => {
    if (deckId) {
      const fetchDeck = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await getDeck(deckId);
          const deckData = response.data;
          
          setDeck(deckData);
          
          const transformedCards: Card[] = deckData.flashcards.map((flashcard: FlashcardDto) => ({
            id: flashcard.id,
            front: flashcard.frontText,
            back: flashcard.backText,
          }));
          
          setCards(transformedCards);
        } catch (err) {
          setError("Failed to fetch deck");
          console.error("Error fetching deck:", err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchDeck();
    }
  };

  return {
    deck,
    cards,
    loading,
    error,
    refetch,
  };
};