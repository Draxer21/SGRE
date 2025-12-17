import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  getSessionStatus,
  loginSession,
  logoutSession,
} from "../services/sessionService.js";

const AuthContext = createContext({
  user: null,
  role: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
  hasRole: () => false,
  canEdit: () => false,
  isAdmin: () => false,
});

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    role: null,
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await getSessionStatus();
      setState({
        user: data?.isAuthenticated ? data?.username ?? "usuario" : null,
        role: data?.role ?? null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({ user: null, role: null, loading: false, error });
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
        role: response?.role ?? null,
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
      setState({ user: null, role: null, loading: false, error: null });
    }
  }, []);

  // Helper functions for role-based permissions
  const hasRole = useCallback((roles) => {
    if (!state.role) return false;
    if (Array.isArray(roles)) {
      return roles.includes(state.role);
    }
    return state.role === roles;
  }, [state.role]);

  const canEdit = useCallback(() => {
    return state.role === 'admin' || state.role === 'editor';
  }, [state.role]);

  const isAdmin = useCallback(() => {
    return state.role === 'admin';
  }, [state.role]);

  const value = useMemo(
    () => ({
      user: state.user,
      role: state.role,
      loading: state.loading,
      error: state.error,
      login,
      logout,
      refresh,
      hasRole,
      canEdit,
      isAdmin,
    }),
    [state, login, logout, refresh, hasRole, canEdit, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
