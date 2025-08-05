// pages/LoginPage.tsx
import { useState } from "react";
import { motion } from "motion/react";
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
      navigate("/home");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-xs p-6"
        initial={{ opacity: 0, y: -50, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <UsernameInput value={username} onChange={setUsername} autoFocus />

        <label className="flex items-center gap-2 py-2">
          <input type="checkbox" className="checkbox checkbox-sm" />
          <span className="label-text text-sm">Remember me</span>
        </label>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-dots loading-md" />
          ) : (
            "Log in"
          )}
        </button>

        {error && <p className="text-error text-sm mt-2">{error}</p>}

        <p className="text-center text-sm pt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="link link-primary">
            Register
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
