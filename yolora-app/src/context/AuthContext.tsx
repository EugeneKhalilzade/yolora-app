// ──────────────────────────────────────────────
// Yolora — Auth Context
// ──────────────────────────────────────────────

import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole, DisabilityType, AuthResponse } from '../types';
import { apiLogin, apiRegister, setAuthToken } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';
import {
  initializeFirebase,
  loginWithFirebase,
  registerWithFirebase,
  signOutFirebase,
} from '../services/firebase';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    disabilityType?: DisabilityType,
  ) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  error: null,
  clearError: () => {},
});

const STORAGE_KEY_USER = '@yolora_user';
const STORAGE_KEY_TOKEN = '@yolora_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load persisted auth on mount
  useEffect(() => {
    initializeFirebase();

    const loadAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(STORAGE_KEY_USER);
        const storedToken = await AsyncStorage.getItem(STORAGE_KEY_TOKEN);

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
          setToken(storedToken);
          setAuthToken(storedToken);
          connectSocket(parsedUser.id);
        }
      } catch (e) {
        console.error('Failed to load auth:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  const handleAuthSuccess = useCallback(async (response: AuthResponse) => {
    setUser(response.user);
    setToken(response.token);
    setAuthToken(response.token);

    await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(response.user));
    await AsyncStorage.setItem(STORAGE_KEY_TOKEN, response.token);

    connectSocket(response.user.id);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await loginWithFirebase(email, password);
      const response = await apiLogin(email, password);
      await handleAuthSuccess(response);
    } catch (e: any) {
      const msg = e.message || 'Login failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthSuccess]);

  const register = useCallback(async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    disabilityType?: DisabilityType,
  ) => {
    setError(null);
    setIsLoading(true);
    try {
      const firebaseSession = await registerWithFirebase(email, password);
      const response = await apiRegister(
        email,
        password,
        displayName,
        role,
        disabilityType,
        firebaseSession?.uid,
      );
      await handleAuthSuccess(response);
    } catch (e: any) {
      const msg = e.message || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthSuccess]);

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    disconnectSocket();
    await signOutFirebase();
    await AsyncStorage.multiRemove([STORAGE_KEY_USER, STORAGE_KEY_TOKEN]);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        error,
        clearError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
