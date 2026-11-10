import React, { createContext, useState, useEffect } from 'react';
import API from '../service/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  
const login = async (email, password) => {
  const { data } = await API.post('/auth/login', {
    email,
    password,
  });

  // IMPORTANT: Save JWT token separately
  sessionStorage.setItem('token', data.token);

  // Save user information
  setUser(data);
  localStorage.setItem('userInfo', JSON.stringify(data));

  return data;
};

const register = async (name, email, password) => {
  const { data } = await API.post('/auth/register', {
    name,
    email,
    password,
  });

  // Save JWT token
  sessionStorage.setItem('token', data.token);

  setUser(data);
  localStorage.setItem('userInfo', JSON.stringify(data));

  return data;
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
