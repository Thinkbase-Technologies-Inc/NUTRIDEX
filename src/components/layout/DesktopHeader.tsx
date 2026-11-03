"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  LogOut,
  User as UserIcon,
  LogIn,
  UserPlus,
  Calendar,
  Check,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSearchStore } from "@/stores/useSearchStore";
import { useToast } from "@/components/ui/Toast";
import { NotificationDropdown } from "@/components/layout/NotificationDropdown";
import { Camera } from "lucide-react";

export function DesktopHeader() {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { openSearch } = useSearchStore();
  const { user, isAuthenticated, openAuthModal, logout, accounts, switchAccount, openAvatarModal } = useAuthStore();
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/alimentos?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/alimentos");
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    showToast({
      type: "info",
      title: "Sesión cerrada",
      description: "Has salido de tu cuenta correctamente.",
      duration: 3000,
    });
  };

  return (
    <header className="hidden md:flex h-16 w-full items-center justify-between border-b border-nutridex-border bg-nutridex-surface/85 px-6 lg:px-8 backdrop-blur-md sticky top-0 z-30">
      {/* Search Input / Spotlight trigger */}
      <div className="relative w-72 lg:w-80 max-w-sm shrink-0">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nutridex-text-secondary pointer-events-none" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClick={() => openSearch(query)}
          onFocus={() => openSearch(query)}
          placeholder="Buscar alimentos, grupos, equivalentes..."
          className="w-full cursor-pointer rounded-full border border-nutridex-border bg-nutridex-surface-muted/60 py-2 pl-9 pr-14 text-xs font-medium text-nutridex-text-primary placeholder:text-nutridex-text-secondary hover:border-nutridex-primary/50 focus:border-nutridex-primary focus:bg-nutridex-surface focus:outline-none focus:ring-1 focus:ring-nutridex-primary transition-colors"
        />
        <button
          type="button"
          onClick={() => openSearch(query)}
          aria-label="Abrir buscador inteligente"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded-md border border-nutridex-border bg-nutridex-surface px-1.5 py-0.5 text-xs font-bold text-nutridex-text-secondary shadow-2xs hover:text-nutridex-primary hover:border-nutridex-primary transition-colors"
        >
          <kbd className="font-sans">⌘</kbd>
          <kbd className="font-sans">K</kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Local-first Pill */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-nutridex-mint/60 px-3 py-1.5 text-xs font-semibold text-nutridex-mint-text border border-nutridex-mint shadow-2xs">
          <Sparkles className="h-3 w-3" aria-hidden />
          <span>ThinkBase Cloudless</span>
        </div>

        {/* Notification Bell Dropdown */}
        <NotificationDropdown />

        {/* User Capsule / Auth Controls */}
        {mounted && isAuthenticated && user ? (
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label={`Menú de usuario: ${user.name}`}
              aria-expanded={isDropdownOpen}
              className="flex items-center gap-2.5 rounded-full border border-nutridex-border bg-nutridex-surface py-1 pl-1 pr-3.5 hover:bg-nutridex-surface-muted/80 transition-all active:scale-[0.98] shrink-0 shadow-2xs group focus-visible:outline-2 focus-visible:outline-nutridex-primary"
            >
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-nutridex-border ring-1 ring-black/5 dark:ring-white/5">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left min-w-0 pr-0.5">
                <span className="text-xs font-bold leading-tight text-nutridex-text-primary whitespace-nowrap truncate max-w-[140px]">
                  {user.name}
                </span>
                <span className="text-xs text-nutridex-text-secondary leading-tight whitespace-nowrap truncate max-w-[140px]">
                  {user.planName ?? "Plan Activo · ThinkBase"}
                </span>
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 text-nutridex-text-secondary shrink-0 transition-transform duration-200 ml-0.5 ${
                  isDropdownOpen ? "rotate-180 text-nutridex-primary" : "group-hover:text-nutridex-text-primary"
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-nutridex-border bg-nutridex-surface p-2 shadow-xl animate__animated animate__fadeIn animate__faster z-50">
                <div className="px-3 py-2.5 border-b border-nutridex-border/60">
                  <span className="text-xs font-extrabold text-nutridex-text-primary block truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-nutridex-text-secondary block truncate">
                    {user.email}
                  </span>
                  <span className="mt-1.5 inline-block rounded-md bg-nutridex-primary-soft px-2 py-0.5 text-xs font-bold text-nutridex-primary">
                    {user.targetCalories} kcal · {user.targetEquivalents} eq
                  </span>
                </div>

                {/* Account Switcher */}
                <div className="py-2 border-b border-nutridex-border/60">
                  <span className="px-3 text-xs font-bold text-nutridex-text-secondary uppercase tracking-wider block mb-1">
                    Cambiar Cuenta
                  </span>
                  {accounts.map((acc) => (
                    <button
                      key={acc.user.id}
                      type="button"
                      onClick={() => {
                        switchAccount(acc.user.id);
                        setIsDropdownOpen(false);
                        showToast({
                          type: "info",
                          title: "Cuenta cambiada",
                          description: `Ahora usando ${acc.user.name}`,
                          duration: 2500,
                        });
                      }}
                      className="flex w-full items-center justify-between px-3 py-1.5 text-xs text-nutridex-text-primary hover:bg-nutridex-surface-muted rounded-xl transition-colors"
                    >
                      <span className="truncate">{acc.user.name}</span>
                      {acc.user.id === user.id && (
                        <Check className="h-3.5 w-3.5 text-nutridex-primary" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-1.5 space-y-0.5">
                  <Link
                    href="/mi-plan"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-nutridex-text-primary hover:bg-nutridex-surface-muted rounded-xl transition-colors"
                  >
                    <Calendar className="h-4 w-4 text-nutridex-primary" />
                    <span>Mi Plan de Comidas</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      openAvatarModal();
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-nutridex-text-primary hover:bg-nutridex-surface-muted rounded-xl transition-colors text-left"
                  >
                    <Camera className="h-4 w-4 text-nutridex-primary" />
                    <span>Cambiar Foto de Perfil</span>
                  </button>
                  <Link
                    href="/configuracion"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-nutridex-text-primary hover:bg-nutridex-surface-muted rounded-xl transition-colors"
                  >
                    <UserIcon className="h-4 w-4 text-nutridex-text-secondary" />
                    <span>Perfil y Ajustes</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : mounted ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="inline-flex items-center gap-1.5 rounded-full border border-nutridex-border bg-nutridex-surface px-3.5 py-1.5 text-xs font-bold text-nutridex-text-primary hover:bg-nutridex-surface-muted transition-colors shadow-2xs"
            >
              <LogIn className="h-3.5 w-3.5 text-nutridex-primary" />
              <span>Iniciar Sesión</span>
            </button>
            <button
              type="button"
              onClick={() => openAuthModal("register")}
              className="inline-flex items-center gap-1.5 rounded-full bg-nutridex-primary px-3.5 py-1.5 text-xs font-bold text-white hover:bg-nutridex-primary-hover transition-colors shadow-2xs"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Registrarse</span>
            </button>
          </div>
        ) : (
          <div className="h-8 w-28 rounded-full bg-nutridex-surface-muted/60 animate-pulse border border-nutridex-border/60" />
        )}
      </div>
    </header>
  );
}
