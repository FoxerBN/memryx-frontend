interface CountsData {
  flashcards: number;
  decks: number;
  folders: number;
}

interface PersonalStatsProps {
  globalCounts?: CountsData;
  personalCounts?: CountsData;
  loading?: boolean;
}

const PersonalStats = ({
  personalCounts,
  globalCounts,
  loading,
}: PersonalStatsProps) => {
  return (
    <div className="flex flex-row items-center h-fit gap-4">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-center mb-2">
          Personal Stats
        </h2>
        <div className="stats bg-base-200 stats-vertical shadow">
          <div className="stat">
            <div className="stat-title text-center">Flashcards</div>
            <div className="stat-value">
              {loading ? "..." : personalCounts?.flashcards || "0"}
            </div>
          </div>

          <div className="stat">
            <div className="stat-title text-center">Decks</div>
            <div className="stat-value">
              {loading ? "..." : personalCounts?.decks || "0"}
            </div>
          </div>

          <div className="stat">
            <div className="stat-title text-center">Folders</div>
            <div className="stat-value">
              {loading ? "..." : personalCounts?.folders || "0"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <h2 className="text-lg font-semibold text-center mb-2">Global Stats</h2>
        <div className="stats bg-base-200 stats-vertical shadow">
          <div className="stat">
            <div className="stat-title text-center">Flashcards</div>
            <div className="stat-value">
              {loading ? "..." : globalCounts?.flashcards || "0"}
            </div>
          </div>

          <div className="stat">
            <div className="stat-title text-center">Decks</div>
            <div className="stat-value">
              {loading ? "..." : globalCounts?.decks || "0"}
            </div>
          </div>

          <div className="stat">
            <div className="stat-title text-center">Folders</div>
            <div className="stat-value">
              {loading ? "..." : globalCounts?.folders || "0"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalStats;
