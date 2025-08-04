// pages/LoginPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UsernameInput from "@/components/ui/form/UsernameInput";
import { useLoginRegister } from "@/hooks/useLoginRegister";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const { loading, error, login } = useLoginRegister();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(username);
    if (ok) {
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
      <UsernameInput value={username} onChange={setUsername} autoFocus />

      <label className="flex items-center gap-2">
        <input type="checkbox" className="checkbox checkbox-sm" />
        <span className="label-text text-sm">Remember me</span>
      </label>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? <span className="loading loading-dots loading-md"></span> : "Log in"}
      </button>

      {error && <p className="text-error text-sm">{error}</p>}

      <p className="text-center text-sm">
        Don’t have an account?{" "}
        <Link to="/register" className="link link-primary">
          Register
        </Link>
      </p>
    </form>
  );
}
