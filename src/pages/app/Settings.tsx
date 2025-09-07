import { logout } from "@/utils/api";
import PersonalStats from "@/components/ui/PersonalStats";
import { useFetchStats } from "@/hooks/useFetchStats";
import { PiSmileySad } from "react-icons/pi";
import DeleteUserModal from "@/components/ui/modal/DeleteUserModal";
export default function Settings() {
  const { data, loading, error } = useFetchStats();
  const handleLogout = () => {
    void logout().finally(() => {
      window.location.replace("/login");
    });
  };


  return (
    <div className="flex flex-col items-center min-w-screen justify-evenly p-6">
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
      <label htmlFor="my_modal_7" className="btn">
        Delete account
        <PiSmileySad size={22} />
      </label>

      <DeleteUserModal />
      <button className="btn btn-error" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
