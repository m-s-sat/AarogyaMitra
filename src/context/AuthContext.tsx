'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserQuery } from '../types';

interface AuthContextType {
  user: User | null;
  login: (userData: UserQuery) => Promise<void>;
  signup: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Sync from backend on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/auth/getuser', {
          credentials: 'include',
        });
        if (!response.ok) {
          setUser(null);
          localStorage.removeItem('healthcare_user');
          localStorage.removeItem('userId');
          return;
        }
        const data = await response.json();
        if (data && data.id) {
          setUser(data);
          localStorage.setItem('healthcare_user', JSON.stringify(data));
          localStorage.setItem('userId', data.id);
        }
      } catch {
        setUser(null);
      }
    };

    // Try localStorage first for faster UI load
    const storedUser = localStorage.getItem('healthcare_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchUser();
  }, []);

  const login = async (userData: UserQuery) => {
    const main = { username: userData.email, password: userData.password };
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(main),
    });
    if (!response.ok) throw new Error('Unauthorized');

    const data = await response.json();
    setUser(data);
    localStorage.setItem('healthcare_user', JSON.stringify(data));
    localStorage.setItem('userId', data.id);
  };

  const signup = async (userData: User) => {
    const main = {
      username: userData.email,
      name: userData.name,
      password: userData.password,
      confirmPassword: userData.password,
      phone: userData.phone,
      preferredLanguage: userData.preferredLanguage,
      avatar: userData.avatar,
      dob: userData.dob,
      pincode: userData.pincode
    };
    const response = await fetch('/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(main),
    });
    if (!response.ok) throw new Error('Unauthorized');

    const data = await response.json();
    setUser(data);
    localStorage.setItem('healthcare_user', JSON.stringify(data));
    localStorage.setItem('userId', data.id);
  };

  const logout = async () => {
    const response = await fetch('/auth/logout', {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Unable to logout the user');

    await response.json();
    setUser(null);
    localStorage.removeItem('healthcare_user');
    localStorage.removeItem('userId');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('healthcare_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    updateUser,
    
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
