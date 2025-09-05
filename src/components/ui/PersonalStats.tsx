const PersonalStats = () => {
  return (
    <div className="stats bg-base-200 stats-vertical shadow">
      <div className="stat">
        <div className="stat-title text-center">Downloads</div>
        <div className="stat-value">31K</div>
      </div>

      <div className="stat">
        <div className="stat-title text-center">New Users</div>
        <div className="stat-value">4,200</div>
      </div>

      <div className="stat">
        <div className="stat-title text-center">New Registers</div>
        <div className="stat-value">1,200</div>
      </div>
    </div>
  );
};

export default PersonalStats;
