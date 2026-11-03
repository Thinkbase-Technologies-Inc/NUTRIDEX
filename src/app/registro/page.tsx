"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
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

export default function RegistroPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const nameError = touched.name ? validateName(name) : null;
  const emailError = touched.email ? validateEmail(email) : null;
  const passwordError = touched.password ? validatePassword(password) : null;
  const confirmPasswordError = touched.confirmPassword
    ? validateConfirmPassword(password, confirmPassword)
    : null;
  const passwordStrength = getPasswordStrength(password);

  const isFormValid =
    validateName(name) === null &&
    validateEmail(email) === null &&
    validatePassword(password) === null &&
    validateConfirmPassword(password, confirmPassword) === null;

  const handleSubmit = async (e: React.FormEvent) => {
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
        description: `Bienvenido a NutriDex, ${name}`,
        duration: 3500,
      });
      router.push("/mi-plan");
    } else {
      setGeneralError(result.error || "Ocurrió un error al registrarse.");
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col justify-center px-4 py-8 sm:px-6">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6 animate__animated animate__fadeInDown">
        <div className="relative mb-3 group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 blur-md opacity-80 group-hover:opacity-100 transition duration-300" />
          <div className="relative rounded-2xl p-1 bg-nutridex-surface border border-nutridex-border shadow-md">
            <NutriDexIcon size={52} glow={false} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl font-black tracking-tight text-nutridex-text-primary flex items-center leading-none">
            Nutri<span className="text-nutridex-primary">Dex</span>
          </h1>
          <span className="rounded-full bg-nutridex-primary-soft px-2.5 py-0.5 text-xs font-bold text-nutridex-primary border border-nutridex-primary/20">
            by ThinkBase
          </span>
        </div>
        <p className="text-xs sm:text-sm text-nutridex-text-secondary mt-1 font-medium">
          Equivalencias Claras · Nutrición Inteligente
        </p>

        <h2 className="text-base sm:text-lg font-bold tracking-tight text-nutridex-text-primary mt-3">
          Crear Cuenta
        </h2>
      </div>

      <div className="nx-card p-6 sm:p-8 shadow-lg animate__animated animate__fadeInUp">
        {generalError && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 animate__animated animate__headShake">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
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
                placeholder="Ej. Sofia Reyes"
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
                placeholder="ejemplo@dominio.com"
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

            {/* Strength meter bar */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
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
                <span>Registrarme gratis</span>
              </>
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="mt-6 text-center pt-4 border-t border-nutridex-border/60">
          <p className="text-xs text-nutridex-text-secondary">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="font-bold text-nutridex-primary hover:underline">
              Iniciar sesión aquí
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-nutridex-text-secondary">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>100% Local-First · Privacidad garantizada</span>
      </div>
    </div>
  );
}
