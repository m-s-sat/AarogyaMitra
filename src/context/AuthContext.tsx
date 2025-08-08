'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Hospital, User, UserQuery } from "../types";

interface AuthContextType {
  user: User | null;
  login: (userData: UserQuery) => Promise<void>;
  signup: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
  hospitalsignup: (hopitalData: Hospital) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch("auth/check", {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Could not fetch user status:", error);
        setUser(null);
      } finally {
        setIsLoading(false); // We are done loading, whether successful or not
      }
    };

    checkUserStatus();
  }, []);
  const hospitalsignup = async (hospitalData: Hospital) => {
    const response = await fetch("/auth/hospitalreg", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(hospitalData),
    });
    if (!response.ok) throw new Error("Unauthorized");
    const data = await response.json();
    setHospital(data.data);
  }
  const login = async (userData: UserQuery) => {
    const response = await fetch("auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: userData.email,
        password: userData.password,
      }),
    });
    if (!response.ok) {
      alert("Unauthorized! Please check your credentials.");
      throw new Error("Unauthorized");
    }
    const data = await response.json();
    setUser(data);
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
      pincode: userData.pincode,
      role: userData.role,
    };
    const response = await fetch("/auth/register", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(main),
    });
    if (!response.ok) throw new Error("Unauthorized");

    const data = await response.json();
    setUser(data);
  };

  const logout = async () => {
    const response = await fetch("/auth/logout", {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Unable to logout the user");

    await response.json();
    setUser(null);
  };

  const updateUser = async (newUserData: Partial<User>) => {
    if (user) {
      const response = await fetch('/auth/profileupdate',{
        credentials: 'include',
        method: 'PATCH',
        headers: {'content-type':'application/json'},
        body: JSON.stringify(newUserData),
      })
      const data = await response.json();
      if (!response.ok) {
        console.error("Error updating user:", data.message);
        return;
      }
      setUser(data.data);
      alert(data.message);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isLoading,
    updateUser,
    hospitalsignup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};