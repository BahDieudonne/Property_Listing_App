import { createContext, useState, useEffect, useCallback } from 'react';

// Create the context object
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);  // The logged-in user object
  const [token,   setToken]   = useState(null);  // The JWT token string
  const [loading, setLoading] = useState(true);  // True while reading from localStorage

  // ===== RESTORE SESSION ON PAGE LOAD =====
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser)); // Parse the JSON string back to an object
    }

    setLoading(false);
  }, []); // Empty array

  // ===== LOGIN =====
  // Saves token and user to both state
  const login = useCallback((tokenData, userData) => {
    localStorage.setItem('token', tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(tokenData);
    setUser(userData);
  }, []);

  // ===== LOGOUT =====
  // Removes all auth data from state
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  // ===== UPDATE USER IN CONTEXT =====
  // Called after profile updates so the UI reflects new data immediately
  const updateUserContext = useCallback((updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  // Provide all auth state and functions to any child component
  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUserContext }}>
      {children}
    </AuthContext.Provider>
  );
};