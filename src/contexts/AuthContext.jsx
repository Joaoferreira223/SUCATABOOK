import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('sucatabook_user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const login = async (email, senha) => {
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        setLoading(false);
        return false;
      }

      const userData = await response.json();

      const loggedUser = {
        id: userData.id || '1',
        username: userData.username || email,
        email: userData.email || email,
        role: userData.role || 'admin',
      };

      setUser(loggedUser);
      localStorage.setItem('sucatabook_user', JSON.stringify(loggedUser));
      if (userData.token) localStorage.setItem('sucatabook_token', userData.token);

      setLoading(false);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);

      // fallback demo
      if (email === 'admin' && senha === 'admin') {
        const demoUser = {
          id: '1',
          username: 'admin',
          email: 'admin@sucatabook.com',
          role: 'admin',
        };
        setUser(demoUser);
        localStorage.setItem('sucatabook_user', JSON.stringify(demoUser));
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sucatabook_user');
    localStorage.removeItem('sucatabook_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user, // ✅ Adicionado
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
