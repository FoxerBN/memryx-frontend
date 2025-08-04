// pages/RegisterPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UsernameInput     from "@/components/ui/form/UsernameInput";
import DisplayNameInput  from "@/components/ui/form/DisplayNameInput";
import { useLoginRegister } from "@/hooks/useLoginRegister";

export default function RegisterPage() {
  const [username,    setUsername]    = useState("");
  const [displayName, setDisplayName] = useState("");
  const { loading, error, register }  = useLoginRegister();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await register(username, displayName);
    if (ok) {
      navigate("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
      <UsernameInput    value={username}    onChange={setUsername} autoFocus />
      <DisplayNameInput value={displayName} onChange={setDisplayName} />

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? <span className="loading loading-dots loading-md"></span> : "Create account"}
      </button>

      {error && <p className="text-error text-sm">{error}</p>}

      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="link link-primary">
          Log in
        </Link>
      </p>
    </form>
  );
}
