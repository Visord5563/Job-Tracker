"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/register", { name, email, password });
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white mb-4">
            <span className="text-black font-bold text-lg">J</span>
          </div>
          <h1 className="text-white text-2xl font-semibold tracking-tight">Create account</h1>
          <p className="text-neutral-500 text-sm mt-1">Start tracking your applications</p>
        </div>

        <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-lg px-3 py-2.5 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
              />
            </div>

            <div>
              <label className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-lg px-3 py-2.5 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
              />
            </div>

            <div>
              <label className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-lg px-3 py-2.5 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-medium text-sm py-2.5 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-neutral-600 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-neutral-300 hover:text-white transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;