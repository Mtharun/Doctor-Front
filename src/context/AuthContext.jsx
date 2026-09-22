// Global auth state. Wrapping the whole app in <AuthProvider> (see main.jsx)
// lets ANY component call useAuth() to read the logged-in user, log in,
// or log out, instead of every page reading localStorage by hand.
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthApi } from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // "loading" is true only while we check for an existing token on first
  // load, so PrivateRoute doesn't redirect to /login before we've had a
  // chance to confirm an existing session is still valid.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // No async check to attach this to - there's simply no session to
      // verify, so we can stop showing the loading state right away.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    AuthApi.me()
      .then((res) => setUser(res.user))
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const updateUser = useCallback((partial) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth is a small hook tied to this context; splitting it into its own
// file would only make AuthContext harder to follow for no real benefit.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
