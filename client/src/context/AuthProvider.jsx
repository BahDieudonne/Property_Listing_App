import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../services/axiosInstance';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    axiosInstance.get('/users/me', { signal: controller.signal })
      .then(({ data }) => setUser(data))
      .catch(err => {
        if (err.name !== 'CanceledError') setUser(null);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      // Clear local state even if the server call fails
    } finally {
      setUser(null);
    }
  }, []);

  const updateUserContext = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/users/me');
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserContext }}>
      {children}
    </AuthContext.Provider>
  );
};
