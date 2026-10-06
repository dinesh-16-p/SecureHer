import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Authentication methods prepared for Firebase Auth integration in Phase 2
  const login = async (email, password) => {
    // Placeholder login flow
    setUser({ email, fullName: 'Demo User', uid: 'demo-123' });
    return true;
  };

  const signup = async (userData) => {
    // Placeholder signup flow
    setUser({ ...userData, uid: 'demo-123' });
    return true;
  };

  const logout = async () => {
    setUser(null);
  };

  const resetPassword = async (email) => {
    return true;
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
