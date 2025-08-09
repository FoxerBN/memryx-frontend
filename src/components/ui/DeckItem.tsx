import type {DeckItemProps} from "@/interface/deckItem";
import { PiCardsThree } from "react-icons/pi";
import { SlOptionsVertical } from "react-icons/sl";
import { base, list as listCard } from "@/const/folderView";

const DeckItem = ({
  name,
  description,
  cardCount,
  className,
  onClick,
  onOptionsClick,
}: DeckItemProps) => {
  return (
    <div className={`${base} ${listCard} ${className ?? ""}`} onClick={onClick}>
      <div className="flex flex-col items-center justify-center w-12 shrink-0 ml-2">
        <div className="text-xs font-semibold">{cardCount}</div>
        <PiCardsThree className="mt-1 rotate-90" size={22} />
      </div>
      <div className="card-body p-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{name}</div>
            {description !== undefined && (
              <div className="text-xs text-base-content/60">{description}</div>
            )}
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            aria-label="Deck options"
            onClick={(e) => {
              e.stopPropagation();
              onOptionsClick?.(e);
            }}
          >
            <SlOptionsVertical />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeckItem;
