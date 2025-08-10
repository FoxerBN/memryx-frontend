import { logout } from "@/utils/api";

export default function Settings() {
  return (
    <div>
      <button onClick={logout} className="btn btn-error">Logout</button>
    </div>
  );
}