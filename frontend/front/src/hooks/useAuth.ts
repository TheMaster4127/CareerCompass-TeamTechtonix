// src/hooks/useAuth.ts
// Minimal localStorage-based auth helper for MVP.
// In production, use proper JWT with expiry and refresh flow.

import { useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("user_id")
  );

  function login(nextToken: string, nextUserId: string) {
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user_id", nextUserId);
    setToken(nextToken);
    setUserId(nextUserId);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setToken(null);
    setUserId(null);
  }

  return {
    token,
    userId,
    login,
    logout,
    isAuthed: !!token,
  };
}
