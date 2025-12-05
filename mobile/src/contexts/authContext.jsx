import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const AuthContext = createContext(null);
const TOKEN_KEY = 'hubivent_auth_token';
const USER_KEY = 'hubivent_user_data';

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load saved auth data on app start
  useEffect(() => {
    async function loadAuth() {
      try {
        const isSecureStoreAvailable = await SecureStore.isAvailableAsync();

        if (isSecureStoreAvailable) {
          const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
          const storedUser = await SecureStore.getItemAsync(USER_KEY);

          if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            console.log('ℹ️ No saved auth data found');
          }
        } else {
          const storedToken = localStorage.getItem(TOKEN_KEY);
          const storedUser = localStorage.getItem(USER_KEY);

          if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('❌ Failed to load auth data:', error);
      } finally {
        setIsLoading(false);
        console.log('✅ Auth initialization complete');
      }
    }

    loadAuth();
  }, []);

  // Login function
  const login = async (newToken, userData) => {
    try {
      const isSecureStoreAvailable = await SecureStore.isAvailableAsync();

      if (isSecureStoreAvailable) {
        await SecureStore.setItemAsync(TOKEN_KEY, newToken);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      } else {
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      }

      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (newToken, userData) => {
    try {
      const isSecureStoreAvailable = await SecureStore.isAvailableAsync();

      if (isSecureStoreAvailable) {
        await SecureStore.setItemAsync(TOKEN_KEY, newToken);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      } else {
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      }

      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('❌ Error saving registration data:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const isSecureStoreAvailable = await SecureStore.isAvailableAsync();

      if (isSecureStoreAvailable) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }

      setToken(null);
      setUser(null);

      router.replace('/(auth)/login');
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  };

  const isAuthenticated = useMemo(() => !!user && !!token, [user, token]);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}