"use client";

import { useState, useEffect, useCallback, useId } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToast } from "@/components/ui/Toast";
import { NutriDexIcon } from "@/components/ui/NutriDexIcon";
import { ThinkBaseLogo } from "@/components/ui/ThinkBaseLogo";
import {
  validateEmail,
  validateName,
  validatePassword,
  validateConfirmPassword,
  getPasswordStrength,
} from "@/domain/authValidation";

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    login,
    register,
  } = useAuthStore();

  const { showToast } = useToast();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Field touched states for progressive validation
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const dialogId = useId();

  useEffect(() => {
    setMode(authModalMode);
    setGeneralError(null);
  }, [authModalMode, isAuthModalOpen]);

  // Real-time validations
  const nameError = touched.name ? validateName(name) : null;
  const emailError = touched.email ? validateEmail(email) : null;
  const passwordError = touched.password ? validatePassword(password) : null;
  const confirmPasswordError = touched.confirmPassword
    ? validateConfirmPassword(password, confirmPassword)
    : null;
  const passwordStrength = getPasswordStrength(password);

  const isLoginFormValid =
    validateEmail(email) === null && validatePassword(password) === null;
  const isRegisterFormValid =
    validateName(name) === null &&
    validateEmail(email) === null &&
    validatePassword(password) === null &&
    validateConfirmPassword(password, confirmPassword) === null;

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    setGeneralError(null);

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr || passErr) {
      setGeneralError(emailErr || passErr);
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      showToast({
        type: "success",
        title: "Sesión iniciada",
        description: `¡Bienvenido(a) a NutriDex!`,
        duration: 3500,
      });
      closeAuthModal();
    } else {
      setGeneralError(result.error || "Ocurrió un error al iniciar sesión.");
      showToast({
        type: "error",
        title: "Error al iniciar sesión",
        description: result.error || "Credenciales incorrectas.",
        duration: 4000,
      });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    setGeneralError(null);

    const nErr = validateName(name);
    const emErr = validateEmail(email);
    const pErr = validatePassword(password);
    const cpErr = validateConfirmPassword(password, confirmPassword);

    if (nErr || emErr || pErr || cpErr) {
      setGeneralError(nErr || emErr || pErr || cpErr);
      return;
    }

    setIsLoading(true);
    const result = await register(name, email, password);
    setIsLoading(false);

    if (result.success) {
      showToast({
        type: "success",
        title: "¡Cuenta creada exitosamente!",
        description: `Bienvenido(a) a NutriDex by ThinkBase, ${name}.`,
        duration: 4000,
      });
      closeAuthModal();
    } else {
      setGeneralError(result.error || "Ocurrió un error al registrarse.");
      showToast({
        type: "error",
        title: "Error de registro",
        description: result.error || "El correo ya está en uso.",
        duration: 4000,
      });
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setTouched({ name: false, email: true, password: true, confirmPassword: false });
    setGeneralError(null);
  };

  if (!isAuthModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate__animated animate__fadeIn animate__faster"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${dialogId}-title`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-nutridex-border bg-nutridex-surface p-6 sm:p-8 shadow-2xl animate__animated animate__zoomIn animate__faster"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          aria-label="Cerrar modal"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-nutridex-surface-muted text-nutridex-text-secondary hover:text-nutridex-text-primary hover:bg-nutridex-border transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="flex flex-col items-center text-center pb-5 border-b border-nutridex-border/60">
          {/* NutriDex Brand Icon with Glow & Border */}
          <div className="relative mb-3 group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 blur-md opacity-80 group-hover:opacity-100 transition duration-300" />
            <div className="relative rounded-2xl p-1 bg-nutridex-surface border border-nutridex-border shadow-md">
              <NutriDexIcon size={48} glow={false} />
            </div>
          </div>

          {/* App Name and By ThinkBase */}
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-nutridex-text-primary flex items-center leading-none">
              Nutri<span className="text-nutridex-primary">Dex</span>
            </h1>
            <span className="rounded-full bg-nutridex-primary-soft px-2.5 py-0.5 text-xs font-bold text-nutridex-primary border border-nutridex-primary/20">
              by ThinkBase
            </span>
          </div>
          <p className="text-xs text-nutridex-text-secondary mt-1 font-medium">
            Equivalencias Claras · Nutrición Inteligente
          </p>

          <h2
            id={`${dialogId}-title`}
            className="text-base sm:text-lg font-bold tracking-tight text-nutridex-text-primary mt-3"
          >
            {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>

          {/* Mode Switch Tabs */}
          <div className="mt-3.5 flex w-full max-w-xs rounded-2xl bg-nutridex-surface-muted/90 p-1 border border-nutridex-border/70 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                openAuthModal("login");
                setGeneralError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all duration-150 ${
                mode === "login"
                  ? "bg-nutridex-surface text-nutridex-text-primary shadow-xs border border-nutridex-border/60"
                  : "text-nutridex-text-secondary hover:text-nutridex-text-primary"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                openAuthModal("register");
                setGeneralError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all duration-150 ${
                mode === "register"
                  ? "bg-nutridex-surface text-nutridex-text-primary shadow-xs border border-nutridex-border/60"
                  : "text-nutridex-text-secondary hover:text-nutridex-text-primary"
              }`}
            >
              Registrarse
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {generalError && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 animate__animated animate__headShake">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Form Body */}
        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="mt-4 space-y-3.5">
            {/* Quick Demo Fill Buttons */}
            <div className="rounded-2xl bg-nutridex-surface-muted/70 p-3 border border-nutridex-border/60">
              <span className="text-xs font-bold text-nutridex-text-secondary block mb-2 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-nutridex-primary" />
                Acceso demo rápido (1 clic):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount("emily.andrian@thinkbase.app", "demo123")}
                  className="flex items-center gap-2 rounded-xl bg-nutridex-surface border border-nutridex-border p-2 text-left hover:border-nutridex-primary hover:bg-nutridex-surface-muted/50 transition-all shadow-2xs group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80"
                    alt="Emily Andrian"
                    className="h-6 w-6 rounded-full object-cover shrink-0 ring-1 ring-nutridex-border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-nutridex-text-primary truncate group-hover:text-nutridex-primary transition-colors">
                      Emily Andrian
                    </p>
                    <p className="text-xs text-nutridex-text-secondary truncate">
                      Plan Activo
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount("gleb.kuznetsov@thinkbase.app", "gleb123")}
                  className="flex items-center gap-2 rounded-xl bg-nutridex-surface border border-nutridex-border p-2 text-left hover:border-nutridex-primary hover:bg-nutridex-surface-muted/50 transition-all shadow-2xs group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80"
                    alt="Gleb Kuznetsov"
                    className="h-6 w-6 rounded-full object-cover shrink-0 ring-1 ring-nutridex-border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-nutridex-text-primary truncate group-hover:text-nutridex-primary transition-colors">
                      Gleb Kuznetsov
                    </p>
                    <p className="text-xs text-nutridex-text-secondary truncate">
                      Plan Pro
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-nutridex-text-secondary block">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nutridex-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (!touched.email) setTouched((prev) => ({ ...prev, email: true }));
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                  placeholder="ejemplo@thinkbase.app"
                  required
                  className={`w-full rounded-2xl border py-2.5 pl-10 pr-10 text-xs sm:text-sm font-medium text-nutridex-text-primary focus:outline-none transition-colors ${
                    touched.email && emailError
                      ? "border-rose-400 bg-rose-50/20 focus:ring-1 focus:ring-rose-400"
                      : touched.email && !emailError && email
                      ? "border-emerald-500 bg-emerald-50/10 focus:ring-1 focus:ring-emerald-500"
                      : "border-nutridex-border bg-nutridex-surface focus:border-nutridex-primary"
                  }`}
                />
                {touched.email && !emailError && email && (
                  <CheckCircle2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                )}
              </div>
              {touched.email && emailError && (
                <p className="text-xs text-rose-500 mt-1">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-nutridex-text-secondary block">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nutridex-text-secondary" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!touched.password) setTouched((prev) => ({ ...prev, password: true }));
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  placeholder="Tu contraseña"
                  required
                  className={`w-full rounded-2xl border py-2.5 pl-10 pr-10 text-xs sm:text-sm font-medium text-nutridex-text-primary focus:outline-none transition-colors ${
                    touched.password && passwordError
                      ? "border-rose-400 bg-rose-50/20 focus:ring-1 focus:ring-rose-400"
                      : touched.password && !passwordError && password
                      ? "border-emerald-500 bg-emerald-50/10 focus:ring-1 focus:ring-emerald-500"
                      : "border-nutridex-border bg-nutridex-surface focus:border-nutridex-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-nutridex-text-secondary hover:text-nutridex-text-primary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {touched.password && passwordError && (
                <p className="text-xs text-rose-500 mt-1">{passwordError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isLoginFormValid}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-nutridex-primary py-3 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-nutridex-primary-hover active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>Entrar a mi cuenta</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-3.5">
            {/* Name Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-nutridex-text-secondary block">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nutridex-text-secondary" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!touched.name) setTouched((prev) => ({ ...prev, name: true }));
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                  placeholder="Ej. Juan Pérez"
                  required
                  className={`w-full rounded-2xl border py-2.5 pl-10 pr-10 text-xs sm:text-sm font-medium text-nutridex-text-primary focus:outline-none transition-colors ${
                    touched.name && nameError
                      ? "border-rose-400 bg-rose-50/20"
                      : touched.name && !nameError && name
                      ? "border-emerald-500"
                      : "border-nutridex-border bg-nutridex-surface focus:border-nutridex-primary"
                  }`}
                />
                {touched.name && !nameError && name && (
                  <CheckCircle2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                )}
              </div>
              {touched.name && nameError && (
                <p className="text-xs text-rose-500 mt-1">{nameError}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-nutridex-text-secondary block">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nutridex-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (!touched.email) setTouched((prev) => ({ ...prev, email: true }));
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                  placeholder="tucorreo@dominio.com"
                  required
                  className={`w-full rounded-2xl border py-2.5 pl-10 pr-10 text-xs sm:text-sm font-medium text-nutridex-text-primary focus:outline-none transition-colors ${
                    touched.email && emailError
                      ? "border-rose-400 bg-rose-50/20"
                      : touched.email && !emailError && email
                      ? "border-emerald-500"
                      : "border-nutridex-border bg-nutridex-surface focus:border-nutridex-primary"
                  }`}
                />
                {touched.email && !emailError && email && (
                  <CheckCircle2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                )}
              </div>
              {touched.email && emailError && (
                <p className="text-xs text-rose-500 mt-1">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-nutridex-text-secondary block">
                  Contraseña (mín. 6 caracteres)
                </label>
                {password && (
                  <span
                    className="text-xs font-extrabold"
                    style={{ color: passwordStrength.colorToken }}
                  >
                    {passwordStrength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nutridex-text-secondary" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!touched.password) setTouched((prev) => ({ ...prev, password: true }));
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  placeholder="Crea una contraseña segura"
                  required
                  className={`w-full rounded-2xl border py-2.5 pl-10 pr-10 text-xs sm:text-sm font-medium text-nutridex-text-primary focus:outline-none transition-colors ${
                    touched.password && passwordError
                      ? "border-rose-400 bg-rose-50/20"
                      : touched.password && !passwordError && password
                      ? "border-emerald-500"
                      : "border-nutridex-border bg-nutridex-surface focus:border-nutridex-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-nutridex-text-secondary hover:text-nutridex-text-primary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Bar */}
              {password && (
                <div className="h-1.5 w-full bg-nutridex-surface-muted rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${passwordStrength.percent}%`,
                      backgroundColor: passwordStrength.colorToken,
                    }}
                  />
                </div>
              )}
              {touched.password && passwordError && (
                <p className="text-xs text-rose-500 mt-1">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-nutridex-text-secondary block">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nutridex-text-secondary" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (!touched.confirmPassword)
                      setTouched((prev) => ({ ...prev, confirmPassword: true }));
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                  placeholder="Repite tu contraseña"
                  required
                  className={`w-full rounded-2xl border py-2.5 pl-10 pr-10 text-xs sm:text-sm font-medium text-nutridex-text-primary focus:outline-none transition-colors ${
                    touched.confirmPassword && confirmPasswordError
                      ? "border-rose-400 bg-rose-50/20"
                      : touched.confirmPassword && !confirmPasswordError && confirmPassword
                      ? "border-emerald-500"
                      : "border-nutridex-border bg-nutridex-surface focus:border-nutridex-primary"
                  }`}
                />
                {touched.confirmPassword && !confirmPasswordError && confirmPassword && (
                  <CheckCircle2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                )}
              </div>
              {touched.confirmPassword && confirmPasswordError && (
                <p className="text-xs text-rose-500 mt-1">{confirmPasswordError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isRegisterFormValid}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-nutridex-primary py-3 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-nutridex-primary-hover active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Crear mi cuenta</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Security badge at bottom */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-nutridex-text-secondary/80">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Datos protegidos en tu almacenamiento seguro</span>
        </div>
      </div>
    </div>
  );
}
