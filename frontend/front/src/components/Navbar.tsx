// src/components/Navbar.tsx
// Navbar without mid links; shows Logout when authenticated.

import logo from "../assets/logo.png"; // or "../assets/logo.svg"
import { isAuthed, logout } from "../lib/auth";

export default function Navbar() {
  const authed = isAuthed();

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-gray-100">
      <div className="cc-container h-16 flex items-center justify-between">
        {/* Logo + Brand */}
        <a href="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Career Compass"
            className="h-8 w-8 rounded-lg object-contain bg-cc-100"
          />
          <span className="font-mont font-bold text-lg">Career Compass</span>
        </a>

        {/* Right-side actions */}
        <div className="flex items-center gap-3">
          {!authed ? (
            <>
              <a href="/login" className="cc-btn-ghost">Sign In</a>
              <a href="/register" className="cc-btn-primary">Get Started</a>
            </>
          ) : (
            <>
              <a href="/dashboard" className="cc-btn-ghost">Dashboard</a>
              <button
                className="cc-btn bg-gray-900 text-white hover:bg-gray-800"
                onClick={logout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
