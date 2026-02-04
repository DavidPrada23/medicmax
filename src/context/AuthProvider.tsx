import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getMyProfile,
  loginUser,
  updateMyProfile,
} from "../services/api";
import { AuthContext } from "./AuthContext";
import type {
  AuthSession,
  AuthUser,
  LoginCredentials,
  Role,
  UpdateProfilePayload,
} from "../types/Auth";

const AUTH_STORAGE_KEY = "medicmax_auth_session";

function saveSession(session: AuthSession) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function loadSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    clearSession();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    const profile = await getMyProfile(token);
    setUser(profile);
    saveSession({ token, user: profile });
  }, [token]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const session = await loginUser(credentials);
    setUser(session.user);
    setToken(session.token);
    saveSession(session);
  }, []);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      if (!token) {
        throw new Error("No hay sesion activa");
      }

      const updated = await updateMyProfile(token, payload);
      setUser(updated);
      saveSession({ token, user: updated });
    },
    [token]
  );

  const hasRole = useCallback(
    (role: Role) => {
      if (!user) return false;
      return user.roles.includes(role);
    },
    [user]
  );

  useEffect(() => {
    const session = loadSession();
    if (!session) {
      setIsLoading(false);
      return;
    }

    setToken(session.token);
    setUser(session.user);

    getMyProfile(session.token)
      .then((profile) => {
        setUser(profile);
        saveSession({ token: session.token, user: profile });
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      hasRole,
      login,
      logout,
      updateProfile,
      refreshProfile,
    }),
    [user, token, isLoading, hasRole, login, logout, updateProfile, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
