import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore, DEFAULT_USER } from "../src/stores/useAuthStore";

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: DEFAULT_USER,
      isAuthenticated: true,
      isAuthModalOpen: false,
      authModalMode: "login",
    });
  });

  it("initializes with default active user", () => {
    const state = useAuthStore.getState();
    expect(state.user).not.toBeNull();
    expect(state.user?.name).toBe("Emily Andrian");
    expect(state.isAuthenticated).toBe(true);
  });

  it("handles successful login", async () => {
    const { login } = useAuthStore.getState();
    const result = await login("emily.andrian@thinkbase.app", "demo123");
    expect(result.success).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.email).toBe("emily.andrian@thinkbase.app");
  });

  it("rejects invalid login credentials", async () => {
    const { login } = useAuthStore.getState();
    const result = await login("wrong@email.com", "wrongpass");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("handles user logout", () => {
    const { logout } = useAuthStore.getState();
    logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("handles new user registration", async () => {
    const { register } = useAuthStore.getState();
    const uniqueEmail = `test-${Date.now()}@thinkbase.app`;
    const res = await register("Carlos Vega", uniqueEmail, "password123");
    expect(res.success).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.name).toBe("Carlos Vega");
    expect(useAuthStore.getState().user?.email).toBe(uniqueEmail);
  });

  it("prevents registering duplicate email", async () => {
    const { register } = useAuthStore.getState();
    const res = await register("Emily Dupe", "emily.andrian@thinkbase.app", "pass123");
    expect(res.success).toBe(false);
    expect(res.error).toContain("ya está registrado");
  });

  it("opens and closes auth modal with modes", () => {
    const { openAuthModal, closeAuthModal } = useAuthStore.getState();
    openAuthModal("register");
    expect(useAuthStore.getState().isAuthModalOpen).toBe(true);
    expect(useAuthStore.getState().authModalMode).toBe("register");

    closeAuthModal();
    expect(useAuthStore.getState().isAuthModalOpen).toBe(false);
  });
});
