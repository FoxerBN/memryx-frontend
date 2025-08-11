// components/ui/FolderItem.tsx
import { TbFolder } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import { base, grid, list, iconWrapGrid, iconWrapList } from "@/const/folderView";
import type { FolderItemProps } from "@/interface/folderItem";

const FolderItem = ({ name, view, count, onOptionsClick }: FolderItemProps) => {
  const isGrid = view === "grid";

  return (
    <div
      className={`${base} ${isGrid ? grid : list} ${onOptionsClick ? (isGrid ? "relative" : "") : ""}`}
    >
      <div className={isGrid ? iconWrapGrid : iconWrapList}>
        <TbFolder className={isGrid ? "w-8 h-8" : "w-5 h-5"} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        {!isGrid && (
          <p className="text-xs mt-0.5">
            {count} deck{count === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {isGrid ? (
        <>
          <p className="text-xs mt-1">
            {count} deck{count === 1 ? "" : "s"}
          </p>

          {onOptionsClick && (
            <button
              type="button"
              className="absolute top-2 right-2 btn btn-ghost btn-xs"
              aria-label="Folder options"
              title="Folder options"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOptionsClick();
              }}
            >
              <BsThreeDotsVertical size={"18"}/>
            </button>
          )}
        </>
      ) : (
        onOptionsClick && (
          <button
            type="button"
            className="btn btn-ghost btn-xs shrink-0 ml-2"
            aria-label="Folder options"
            title="Folder options"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOptionsClick();
            }}
          >
            <BsThreeDotsVertical size={"18"}/>
          </button>
        )
      )}
    </div>
  );
};

export default FolderItem;
