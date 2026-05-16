import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Will hold { name, email, roles, isProvider, etc }
  const [roles, setRoles] = useState([]); // ["user", "provider"]
  const [activeMode, setActiveMode] = useState("hiring"); // "hiring" | "provider"
  const [loading, setLoading] = useState(true);

  // Load user from localStorage immediately when the app starts
  useEffect(() => {
    try {
      const storedSession = localStorage.getItem("hmb_session");
      if (storedSession) {
        const parsedSession = JSON.parse(storedSession);
        setUser(parsedSession.user || null);
        setRoles(parsedSession.user?.roles || []);
        setActiveMode(parsedSession.activeMode || "hiring");
      } else {
        const storedUser = localStorage.getItem("hmb_user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setRoles(parsedUser.roles || []);
          setActiveMode(parsedUser.roles?.includes("provider") ? "provider" : "hiring");
        }
      }
    } catch (e) {
      console.error("Failed to load user state", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, preferredMode) => {
    const nextRoles = userData?.roles || ["user"];
    const canBeProvider = nextRoles.includes("provider");
    const nextMode = preferredMode || (canBeProvider ? "provider" : "hiring");

    setUser(userData);
    setRoles(nextRoles);
    setActiveMode(nextMode);

    // Persist the session state across page refreshes
    localStorage.setItem("hmb_session", JSON.stringify({ user: userData, activeMode: nextMode }));
  };

  const logout = () => {
    setRoles([]);
    setUser(null);
    setActiveMode("hiring");
    // Clear user state
    localStorage.removeItem("hmb_user");
    localStorage.removeItem("hmb_session");
  };

  if (loading) return null; // Prevent flicker while checking auth state

  const switchMode = (mode) => {
    // Save the selected mode so the UI stays consistent
    if (mode === "provider" && !roles.includes("provider")) {
      return;
    }
    setActiveMode(mode);
    localStorage.setItem("hmb_session", JSON.stringify({ user, activeMode: mode }));
  };

  return (
    <AuthContext.Provider value={{ user, roles, activeMode, switchMode, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}