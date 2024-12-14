
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (token: string, user: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const isAuthenticated = !!token;

  useEffect(() => {
    console.log("AuthProvider mounted");

    const fetchStoredData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken) {
          setToken(storedToken);
          console.log("Token retrieved from storage:", storedToken);
        } else {
          console.log("No token found in storage");
        }

        if (storedUser) {
          setUser(storedUser);
          console.log("User retrieved from storage:", storedUser);
        } else {
          console.log("No user found in storage");
        }
      } catch (error) {
        console.error("Error fetching stored data:", error);
      }
    };

    fetchStoredData();
  }, []);

  const login = async (token: string, user: string) => {
    console.log("Login called with token:", token, "and user:", user);

    setToken(token);
    console.log("Token set to:", token);

    setUser(user);
    console.log("User set to:", user);

    try {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', user);
      console.log('User and token stored successfully');
    } catch (error) {
      console.error('Error storing auth data to localstorage:', error);
    }
  };

  const logout = async () => {
    console.log("Logout called");
    setToken(null);
    setUser(null);
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      console.log('Auth data removed successfully');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
