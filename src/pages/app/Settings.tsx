import { logout } from "@/utils/api";

export default function Settings() {
  const handleLogout = () => {
    void logout().finally(() => {
      // Hard redirect so cookie changes are applied before app boots
      window.location.replace("/login");
    });
  };

  return (
    <div>
      <button className="btn btn-error" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}