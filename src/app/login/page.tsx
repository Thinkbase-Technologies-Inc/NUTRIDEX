"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  LogOut,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToast } from "@/components/ui/Toast";
import { NutriDexIcon } from "@/components/ui/NutriDexIcon";
import { ThinkBaseLogo } from "@/components/ui/ThinkBaseLogo";
import { validateEmail, validatePassword } from "@/domain/authValidation";

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError = touched.email ? validateEmail(email) : null;
  const passwordError = touched.password ? validatePassword(password) : null;
  const isFormValid = validateEmail(email) === null && validatePassword(password) === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
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
        title: "Sesión iniciada con éxito",
        description: "Bienvenido a NutriDex by ThinkBase",
        duration: 3000,
      });
      router.push("/mi-plan");
    } else {
      setGeneralError(result.error || "Credenciales incorrectas.");
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setTouched({ email: true, password: true });
    setGeneralError(null);
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
      </div>

      {isAuthenticated && user ? (
        <div className="nx-card p-6 text-center space-y-4 animate__animated animate__fadeIn">
          <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-4 border-nutridex-border shadow-md">
            <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-nutridex-text-primary">{user.name}</h2>
            <p className="text-xs text-nutridex-text-secondary">{user.email}</p>
            <span className="mt-2 inline-block rounded-full bg-nutridex-primary-soft px-3 py-1 text-xs font-bold text-nutridex-primary">
              Sesión activa
            </span>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/mi-plan"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-nutridex-primary py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-nutridex-primary-hover transition-colors"
            >
              <Calendar className="h-4 w-4" />
              <span>Ir a mi planificador</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                logout();
                showToast({
                  type: "info",
                  title: "Sesión cerrada",
                  description: "Has cerrado sesión correctamente.",
                  duration: 2500,
                });
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-nutridex-border bg-nutridex-surface py-2.5 text-xs font-bold text-nutridex-text-secondary hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="nx-card p-6 sm:p-8 shadow-lg animate__animated animate__fadeInUp">
          {generalError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 animate__animated animate__headShake">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Quick Demo Fill Buttons */}
          <div className="rounded-2xl bg-nutridex-surface-muted/70 p-3 border border-nutridex-border/60 mb-5">
            <span className="text-xs font-bold text-nutridex-text-secondary block mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-nutridex-primary" />
              Acceso rápido demo (1 clic):
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

          <form onSubmit={handleSubmit} className="space-y-4">
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
              {touched.password && passwordError && (
                <p className="text-xs text-rose-500 mt-1">{passwordError}</p>
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
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>Iniciar sesión</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 text-center pt-4 border-t border-nutridex-border/60">
            <p className="text-xs text-nutridex-text-secondary">
              ¿No tienes una cuenta aún?{" "}
              <Link
                href="/registro"
                className="font-bold text-nutridex-primary hover:underline"
              >
                Crear cuenta gratis
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Security badge at bottom */}
      <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-nutridex-text-secondary">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>100% Local-First · Privacidad garantizada</span>
      </div>
    </div>
  );
}
