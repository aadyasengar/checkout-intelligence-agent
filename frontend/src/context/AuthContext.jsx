import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock session
    const savedUser = localStorage.getItem('kasparai_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login - accepts any valid looking email for demo purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0],
        };
        setUser(mockUser);
        localStorage.setItem('kasparai_user', JSON.stringify(mockUser));
        resolve({ success: true });
      }, 800);
    });
  };

  const signup = (name, email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          email,
          name,
        };
        setUser(mockUser);
        localStorage.setItem('kasparai_user', JSON.stringify(mockUser));
        resolve({ success: true });
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kasparai_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
