export type FolderSummary = {
  id: number;
  name: string;
  deckCount: number;
};

export type CacheShape = {
  version: number;
  updatedAt: number;
  folders: FolderSummary[];
};