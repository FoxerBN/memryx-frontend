import { TbFolder } from "react-icons/tb";
import { base, grid, list, iconWrapGrid, iconWrapList } from "@/const/folderView";
import type { FolderItemProps } from "@/interface/folderItem";


const FolderItem = ({ name, view, count }: FolderItemProps) => {

  return (
    <div className={`${base} ${view === "grid" ? grid : list}`}>
      <div className={view === "grid" ? iconWrapGrid : iconWrapList}>
        <TbFolder
          className={view === "grid" ? "w-8 h-8 " : "w-5 h-5 "}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        {view !== "grid" && (
          <p className="text-xs mt-0.5">
            {count} deck{count === 1 ? "" : "s"}
          </p>
        )}
      </div>
      {view === "grid" && (
        <p className="text-xs mt-1">{count} deck{count === 1 ? "" : "s"}</p>
      )}
    </div>
  );
};

export default FolderItem;
