import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import UsernameInput from "@/components/ui/form/UsernameInput";
import DisplayNameInput from "@/components/ui/form/DisplayNameInput";
import { useLoginRegister } from "@/hooks/useLoginRegister";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { loading, error, register } = useLoginRegister();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await register(username, displayName);
    if (ok) {
      navigate("/login");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-xs bg-base-100 p-6 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: -50, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <UsernameInput value={username} onChange={setUsername} autoFocus />
        <DisplayNameInput value={displayName} onChange={setDisplayName} />

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-dots loading-md" />
          ) : (
            "Create account"
          )}
        </button>

        {error && <p className="text-error text-sm mt-2">{error}</p>}

        <p className="text-center text-sm pt-6">
          Already have an account?{" "}
          <Link to="/login" className="link link-primary">
            Log in
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
