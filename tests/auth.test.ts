import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validateName,
  validatePassword,
  validateConfirmPassword,
  getPasswordStrength,
} from "../src/domain/authValidation";

describe("Auth Validation - Real Time Rules", () => {
  describe("validateEmail", () => {
    it("rejects empty email", () => {
      expect(validateEmail("")).toContain("requerido");
      expect(validateEmail("   ")).toContain("requerido");
    });

    it("rejects invalid emails", () => {
      expect(validateEmail("invalid-email")).toContain("válido");
      expect(validateEmail("user@domain")).toContain("válido");
      expect(validateEmail("@domain.com")).toContain("válido");
    });

    it("accepts valid emails", () => {
      expect(validateEmail("emily@thinkbase.com")).toBeNull();
      expect(validateEmail("user.name+tag@example.co.uk")).toBeNull();
    });
  });

  describe("validateName", () => {
    it("rejects empty or single char names", () => {
      expect(validateName("")).toContain("requerido");
      expect(validateName("A")).toContain("al menos 2");
    });

    it("accepts valid names", () => {
      expect(validateName("Emily Andrian")).toBeNull();
      expect(validateName("Juan Pérez")).toBeNull();
    });
  });

  describe("validatePassword", () => {
    it("rejects empty or short passwords", () => {
      expect(validatePassword("")).toContain("requerida");
      expect(validatePassword("12345")).toContain("al menos 6");
    });

    it("accepts passwords with 6 or more characters", () => {
      expect(validatePassword("password123")).toBeNull();
    });
  });

  describe("validateConfirmPassword", () => {
    it("checks for match", () => {
      expect(validateConfirmPassword("pass123", "")).toContain("Confirma");
      expect(validateConfirmPassword("pass123", "pass456")).toContain("no coinciden");
      expect(validateConfirmPassword("pass123", "pass123")).toBeNull();
    });
  });

  describe("getPasswordStrength", () => {
    it("evaluates empty password as muy débil", () => {
      const s = getPasswordStrength("");
      expect(s.score).toBe(0);
      expect(s.percent).toBe(0);
    });

    it("evaluates simple password as débil", () => {
      const s = getPasswordStrength("abcdef");
      expect(s.score).toBe(1);
      expect(s.percent).toBe(25);
    });

    it("evaluates password with letters and numbers", () => {
      const s = getPasswordStrength("abcdef1234");
      expect(s.score).toBe(3); // >= 6, >= 10, has numbers
      expect(s.percent).toBe(75);
    });

    it("evaluates strong complex password as excelente", () => {
      const s = getPasswordStrength("P@ssw0rd!Secure");
      expect(s.score).toBe(4);
      expect(s.percent).toBe(100);
      expect(s.label).toBe("Excelente");
    });
  });
});
