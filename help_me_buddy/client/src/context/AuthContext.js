import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Will hold { name, email, profileImage, etc }
  const [role, setRole] = useState(null); // 'user' or 'provider'

  const login = (selectedRole, userData) => {
    setRole(selectedRole);
    setUser(userData);
  };

  const logout = () => {
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}