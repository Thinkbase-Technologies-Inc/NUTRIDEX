export interface PasswordStrength {
  score: number; // 0 to 4
  label: "Muy débil" | "Débil" | "Regular" | "Buena" | "Excelente";
  colorToken: string; // Tailwind/HEX color
  percent: number; // 0 to 100
}

/**
 * Validates email address format in real-time.
 */
export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return "El correo electrónico es requerido.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return "Ingresa un correo electrónico válido (ej. usuario@dominio.com).";
  }
  return null;
}

/**
 * Validates user's full name.
 */
export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return "El nombre completo es requerido.";
  }
  if (trimmed.length < 2) {
    return "El nombre debe tener al menos 2 caracteres.";
  }
  return null;
}

/**
 * Validates password format.
 */
export function validatePassword(password: string): string | null {
  if (!password) {
    return "La contraseña es requerida.";
  }
  if (password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  return null;
}

/**
 * Validates matching confirmation password.
 */
export function validateConfirmPassword(password: string, confirm: string): string | null {
  if (!confirm) {
    return "Confirma tu contraseña.";
  }
  if (password !== confirm) {
    return "Las contraseñas no coinciden.";
  }
  return null;
}

/**
 * Evaluates password strength dynamically in real-time.
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: "Muy débil", colorToken: "#ef4444", percent: 0 };
  }

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  switch (score) {
    case 1:
      return { score: 1, label: "Débil", colorToken: "#ef4444", percent: 25 };
    case 2:
      return { score: 2, label: "Regular", colorToken: "#f59e0b", percent: 50 };
    case 3:
      return { score: 3, label: "Buena", colorToken: "#06b6d4", percent: 75 };
    case 4:
      return { score: 4, label: "Excelente", colorToken: "#15803d", percent: 100 };
    default:
      return { score: 0, label: "Muy débil", colorToken: "#ef4444", percent: 10 };
  }
}
