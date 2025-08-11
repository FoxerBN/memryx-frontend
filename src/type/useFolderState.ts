import type { FolderSummary } from "@/type/folderApi";

export type UseFolderState = {
  folders: FolderSummary[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (name: string) => Promise<boolean>;
  rename: (id: number, newName: string) => Promise<boolean>;
  remove: (id: number) => Promise<boolean>;
};