import { logout } from "@/utils/api";
import PersonalStats from "@/components/ui/PersonalStats";
export default function Settings() {
  const handleLogout = () => {
    void logout().finally(() => {
      window.location.replace("/login");
    });
  };

  return (
    <div className="flex flex-col justify-around p-6">
      <PersonalStats />
      <button className="btn btn-error" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}