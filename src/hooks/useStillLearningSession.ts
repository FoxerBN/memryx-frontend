import { useState } from "react";
import React from "react";

type Card = {
  id: string | number;
  front: React.ReactNode;
  back: React.ReactNode;
};

export function useStillLearningSession(originalCards: Card[]) {
  const [isStillLearningMode, setIsStillLearningMode] = useState(false);
  const [stillLearningCards, setStillLearningCards] = useState<Set<string | number>>(new Set());
  const [stillLearningSessionCards, setStillLearningSessionCards] = useState<Card[]>([]);
  const [stillLearningSessionTotal, setStillLearningSessionTotal] = useState(0);

  const addToStillLearning = (cardId: string | number) => {
    setStillLearningCards(prev => new Set([...prev, cardId]));
  };

  const removeFromStillLearning = (cardId: string | number) => {
    setStillLearningCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
  };

  const startStillLearningSession = () => {
    setIsStillLearningMode(true);
    
    const session = originalCards.filter((card) =>
      stillLearningCards.has(card.id)
    );
    setStillLearningSessionCards(session);
    setStillLearningSessionTotal(session.length);
  };

  const exitStillLearningMode = () => {
    setIsStillLearningMode(false);
    setStillLearningSessionCards([]);
    setStillLearningSessionTotal(0);
  };

  const resetStillLearningState = () => {
    setIsStillLearningMode(false);
    setStillLearningCards(new Set());
    setStillLearningSessionCards([]);
    setStillLearningSessionTotal(0);
  };

  return {
    // State
    isStillLearningMode,
    stillLearningCards,
    stillLearningSessionCards,
    stillLearningSessionTotal,
    
    // Actions
    addToStillLearning,
    removeFromStillLearning,
    startStillLearningSession,
    exitStillLearningMode,
    resetStillLearningState,
  };
}