import type { MouseEventHandler } from "react";
export type DeckItemProps = {
  name: string;
  description?: string;
  cardCount: number;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onOptionsClick?: MouseEventHandler<HTMLButtonElement>;
};