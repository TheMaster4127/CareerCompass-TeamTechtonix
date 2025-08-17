// src/lib/auth.ts
export function logout() {
  try {
    // Optional: call backend to invalidate token (ignore errors if endpoint not present)
    // await fetch(`${import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "")}/api/logout`, {
    //   method: "POST",
    //   headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
    // });

  } catch {
    // ignore network errors on logout
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    // Hard redirect to clear any in-memory state
    window.location.href = "/login";
  }
}

export function isAuthed(): boolean {
  return !!localStorage.getItem("token");
}
