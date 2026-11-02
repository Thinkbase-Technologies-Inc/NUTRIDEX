"use client";

import { create } from "zustand";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  targetCalories: number;
  targetEquivalents: number;
  planName?: string;
  createdAt: string;
}

export interface StoredAccount {
  user: UserProfile;
  passwordHash: string;
}

export const DEFAULT_USER: UserProfile = {
  id: "user-emily",
  name: "Emily Andrian",
  email: "emily.andrian@thinkbase.app",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
  targetCalories: 1820,
  targetEquivalents: 14,
  planName: "Plan Activo · ThinkBase",
  createdAt: "2026-01-10T08:00:00.000Z",
};

export const DEMO_ACCOUNTS: StoredAccount[] = [
  {
    user: DEFAULT_USER,
    passwordHash: "demo123",
  },
  {
    user: {
      id: "user-gleb",
      name: "Gleb Kuznetsov",
      email: "gleb.kuznetsov@thinkbase.app",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
      targetCalories: 2200,
      targetEquivalents: 16,
      planName: "Plan Pro · ThinkBase",
      createdAt: "2026-02-01T10:00:00.000Z",
    },
    passwordHash: "gleb123",
  },
];

const STORAGE_KEY_USER = "nutridex_current_user";
const STORAGE_KEY_ACCOUNTS = "nutridex_user_accounts";

function loadInitialAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return DEMO_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(DEMO_ACCOUNTS));
      return DEMO_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEMO_ACCOUNTS;
  } catch {
    return DEMO_ACCOUNTS;
  }
}

function loadInitialUser(): UserProfile | null {
  if (typeof window === "undefined") return DEFAULT_USER;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw === "null") return null;
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  isAvatarModalOpen: boolean;
  authModalMode: "login" | "register";
  accounts: StoredAccount[];

  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    avatarUrl?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  openAvatarModal: () => void;
  closeAvatarModal: () => void;
  switchAccount: (userId: string) => void;
  syncUsersFromNeon: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const initialUser = typeof window !== "undefined" ? loadInitialUser() : DEFAULT_USER;
  const initialAccounts = typeof window !== "undefined" ? loadInitialAccounts() : DEMO_ACCOUNTS;

  return {
    user: initialUser,
    isAuthenticated: initialUser !== null,
    isAuthModalOpen: false,
    isAvatarModalOpen: false,
    authModalMode: "login",
    accounts: initialAccounts,

    login: async (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();

      // 1. Try Neon Lakebase Postgres API first
      try {
        const res = await fetch("/api/neon/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail, password }),
        });

        const data = await res.json();
        if (res.ok && data.success && data.user) {
          const loggedInUser: UserProfile = data.user;
          const accounts = get().accounts;
          const updatedAccounts = accounts.some((a) => a.user.id === loggedInUser.id)
            ? accounts.map((a) => (a.user.id === loggedInUser.id ? { ...a, user: loggedInUser } : a))
            : [...accounts, { user: loggedInUser, passwordHash: password }];

          set({
            user: loggedInUser,
            isAuthenticated: true,
            accounts: updatedAccounts,
            isAuthModalOpen: false,
          });

          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(loggedInUser));
            localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(updatedAccounts));
          }
          return { success: true };
        } else if (res.status === 401 || res.status === 400) {
          return { success: false, error: data.error || "Credenciales incorrectas" };
        }
      } catch {
        // Fallback to local accounts check if network offline
      }

      // 2. Offline fallback
      const localAccount = get().accounts.find(
        (acc) => acc.user.email.toLowerCase() === normalizedEmail && acc.passwordHash === password
      );

      if (!localAccount) {
        return {
          success: false,
          error: "Credenciales incorrectas. Verifica tus datos o usa la cuenta demo.",
        };
      }

      set({
        user: localAccount.user,
        isAuthenticated: true,
        isAuthModalOpen: false,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(localAccount.user));
      }

      return { success: true };
    },

    register: async (name: string, email: string, password: string, avatarUrl?: string) => {
      const normalizedEmail = email.trim().toLowerCase();

      // 1. Try Neon Lakebase Postgres API
      try {
        const res = await fetch("/api/neon/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: normalizedEmail,
            password,
            avatarUrl,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success && data.user) {
          const newUser: UserProfile = data.user;
          const updatedAccounts = [...get().accounts, { user: newUser, passwordHash: password }];

          set({
            user: newUser,
            isAuthenticated: true,
            accounts: updatedAccounts,
            isAuthModalOpen: false,
          });

          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
            localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(updatedAccounts));
          }

          return { success: true };
        } else if (res.status === 409 || res.status === 400) {
          return { success: false, error: data.error };
        }
      } catch {
        // Fallback to local creation if offline
      }

      const existing = get().accounts.find(
        (acc) => acc.user.email.toLowerCase() === normalizedEmail
      );

      if (existing) {
        return {
          success: false,
          error: "Este correo electrónico ya está registrado. Inicia sesión en su lugar.",
        };
      }

      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        avatarUrl:
          avatarUrl ||
          `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80`,
        targetCalories: 2000,
        targetEquivalents: 14,
        planName: "Plan Personal · ThinkBase",
        createdAt: new Date().toISOString(),
      };

      const updatedAccounts = [...get().accounts, { user: newUser, passwordHash: password }];

      set({
        user: newUser,
        isAuthenticated: true,
        accounts: updatedAccounts,
        isAuthModalOpen: false,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(updatedAccounts));
      }

      return { success: true };
    },

    logout: () => {
      set({
        user: null,
        isAuthenticated: false,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_USER, "null");
      }
    },

    updateProfile: async (data: Partial<UserProfile>) => {
      const currentUser = get().user;
      if (!currentUser) return;
      const updatedUser = { ...currentUser, ...data };
      const updatedAccounts = get().accounts.map((acc) =>
        acc.user.id === currentUser.id ? { ...acc, user: updatedUser } : acc
      );

      set({
        user: updatedUser,
        accounts: updatedAccounts,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(updatedAccounts));
      }

      // Sync to NeonDB in background
      try {
        await fetch("/api/neon/auth/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: currentUser.email,
            name: updatedUser.name,
            avatarUrl: updatedUser.avatarUrl,
            targetCalories: updatedUser.targetCalories,
            targetEquivalents: updatedUser.targetEquivalents,
            planName: updatedUser.planName,
          }),
        });
      } catch {}
    },

    openAuthModal: (mode: "login" | "register" = "login") => {
      set({ isAuthModalOpen: true, authModalMode: mode });
    },

    closeAuthModal: () => {
      set({ isAuthModalOpen: false });
    },

    openAvatarModal: () => {
      set({ isAvatarModalOpen: true });
    },

    closeAvatarModal: () => {
      set({ isAvatarModalOpen: false });
    },

    switchAccount: (userId: string) => {
      const target = get().accounts.find((acc) => acc.user.id === userId);
      if (target) {
        set({
          user: target.user,
          isAuthenticated: true,
        });
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(target.user));
        }
      }
    },

    syncUsersFromNeon: async () => {
      try {
        const res = await fetch("/api/neon/auth/users");
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.users)) {
          const neonUsers: UserProfile[] = data.users;
          const currentAccounts = get().accounts;
          const mergedAccounts: StoredAccount[] = [...currentAccounts];

          for (const u of neonUsers) {
            if (!mergedAccounts.some((a) => a.user.email.toLowerCase() === u.email.toLowerCase())) {
              mergedAccounts.push({ user: u, passwordHash: "demo123" });
            }
          }

          set({ accounts: mergedAccounts });
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(mergedAccounts));
          }
        }
      } catch {}
    },
  };
});
