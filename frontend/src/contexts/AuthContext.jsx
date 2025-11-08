import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  getSessionStatus,
  loginSession,
  logoutSession,
} from "../services/sessionService.js";

const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
});

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await getSessionStatus();
      setState({
        user: data?.isAuthenticated ? data?.username ?? "usuario" : null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({ user: null, loading: false, error });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async ({ username, password, remember = true }) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await loginSession({ username, password, remember });
      setState({
        user: response?.username ?? username,
        loading: false,
        error: null,
      });
      return response;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error?.response?.data?.detail ?? "No fue posible iniciar sesión.",
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutSession();
    } finally {
      setState({ user: null, loading: false, error: null });
    }
  }, []);

  const value = useMemo(
    () => ({
      user: state.user,
      loading: state.loading,
      error: state.error,
      login,
      logout,
      refresh,
    }),
    [state, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
