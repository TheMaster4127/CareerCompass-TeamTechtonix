// src/pages/Auth/Register.tsx
// Registration screen with logo (no social logins)

import { useState } from "react";
import { api } from "../../lib/api";
import logo from "../../assets/logo.png"; // If SVG, use "../../assets/logo.svg"

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post("/register", { name, email, password, role: "student" });
      window.location.href = "/login";
    } catch (err: any) {
      setError(err?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="cc-container py-10">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left gradient intro */}
        <div className="rounded-2xl bg-hero-grad min-h-[500px] p-8 border border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Career Compass"
              className="h-8 w-8 rounded-lg object-contain bg-white/70"
            />
            <div className="font-mont font-bold text-lg">Career Compass</div>
          </div>

          <div className="mt-16 max-w-md">
            <h2 className="font-mont font-semibold text-2xl">Welcome to Career Compass</h2>
            <p className="mt-3 text-gray-700">
              We are a community helping you navigate potential and map your future.
            </p>
            <p className="mt-16 text-gray-500 text-sm">Secure and private • No spam</p>
          </div>
        </div>

        {/* Right form */}
        <div className="rounded-2xl border border-gray-200 p-8">
          <div className="flex justify-end text-sm text-gray-600">
          </div>

          <h1 className="font-mont font-bold text-3xl mt-2">Create your account</h1>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                className="w-full rounded-lg border border-gray-300 h-11 px-3 outline-none focus:ring-2 focus:ring-cc-300"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                className="w-full rounded-lg border border-gray-300 h-11 px-3 outline-none focus:ring-2 focus:ring-cc-300"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input
                className="w-full rounded-lg border border-gray-300 h-11 px-3 outline-none focus:ring-2 focus:ring-cc-300"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Confirm password</label>
              <input
                className="w-full rounded-lg border border-gray-300 h-11 px-3 outline-none focus:ring-2 focus:ring-cc-300"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              type="submit"
              className="w-full cc-btn bg-cc-700 text-white hover:bg-cc-800"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create account"}
            </button>

            {/* Removed social logins */}
            <div className="text-sm text-gray-600 text-center mt-6">
              Already have an account?&nbsp;
              <a className="text-cc-700 hover:underline" href="/login">Sign in</a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
