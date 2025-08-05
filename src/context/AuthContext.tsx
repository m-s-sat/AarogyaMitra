'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserQuery } from '../types/index.ts';

interface AuthContextType {
  user: User | null;
  login: (userData: UserQuery) => void;
  signup: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(()=>{
    const fetchuser = async()=>{
      try{
        const response = await fetch('http://localhost:5000/auth/getuser',{
          credentials:'include'
        });
        if(!response.ok) setUser(null);
        const data = await response.json();
        if(data && data.id){
          setUser(data);
          console.log(data);
        }
        else setUser(null);
      }
      catch(err){
        setUser(null);
      }
    }
    fetchuser();
  },[]);
  const login = async (userData: UserQuery) => {
    const main = { username: userData.email, password: userData.password };
    const response = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(main),
    });
    if (!response.ok) throw new Error("Unauthorized");
    const data = await response.json();
    setUser(data);
    localStorage.setItem('healthcare_user', JSON.stringify(data));
  };

  const signup = async (userData: User) => {
    const main = { username: userData.email, name:userData.name ,password: userData.password, confirmPassword: userData.password, phone: userData.phone ,preferredLanguage: userData.preferredLanguage, avatar: userData.avatar};
    const response = await fetch('http://localhost:5000/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(main),
    });
    if (!response.ok) throw new Error('Unauthorized');
    const data = await response.json();
    setUser(data);
    localStorage.setItem('healthcare_user', JSON.stringify(data));
  };

  const logout = async() => {
    const response = await fetch('http://localhost:5000/auth/logout',{
      credentials: 'include',
    })
    if(!response.ok) throw new Error("Unable to logout the user");
    const data = await response.json();
    console.log(data);
    setUser(null);
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