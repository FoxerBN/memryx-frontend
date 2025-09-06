import { logout } from "@/utils/api";
import PersonalStats from "@/components/ui/PersonalStats";
import { useFetchStats } from "@/hooks/useFetchStats";
export default function Settings() {
  const { data, loading, error } = useFetchStats();

  const handleLogout = () => {
    void logout().finally(() => {
      window.location.replace("/login");
    });
  };

  return (
    <div className="flex flex-col justify-around p-6">
      {error && (
        <div className="alert alert-error mb-4">
          <span>Error: {error}</span>
        </div>
      )}

      <PersonalStats
        globalCounts={data?.globalCounts}
        personalCounts={data?.personalCounts}
        loading={loading}
      />
      <button className="btn btn-error" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
