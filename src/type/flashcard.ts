import React from "react";

export type Card = {
  id: string | number;
  front: React.ReactNode;
  back: React.ReactNode;
};

export type CardHistory = {
  cardId: string | number;
  category: "known" | "learning" | "none";
};

export interface FlashcardSetProps {
  cards: Card[];
  startIndex?: number;
  onCountChange?: (stats: {
    known: number;
    learning: number;
    index: number;
  }) => void;
}

export interface MiddleHandle {
  reset: () => void;
}