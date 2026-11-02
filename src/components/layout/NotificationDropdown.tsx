"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Sparkles,
  AlertCircle,
  Calendar,
  CheckCircle2,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import type { NotificationRow } from "@/lib/db";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  const email = user?.email ?? "emily.andrian@thinkbase.app";

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/neon/notificaciones?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok && Array.isArray(data.notificaciones)) {
        setNotifications(data.notificaciones);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await fetch("/api/neon/notificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read", email }),
      });
    } catch {}
  };

  const markOneRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try {
      await fetch("/api/neon/notificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read", id, email }),
      });
    } catch {}
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
      case "alert":
        return <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />;
      case "plan":
        return <Calendar className="h-4 w-4 text-nutridex-cyan shrink-0" />;
      default:
        return <Sparkles className="h-4 w-4 text-nutridex-primary shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        aria-label={`Notificaciones (${unreadCount} sin leer)`}
        aria-expanded={isOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-nutridex-border bg-nutridex-surface text-nutridex-text-secondary hover:bg-nutridex-surface-muted hover:text-nutridex-text-primary transition-all active:scale-95"
      >
        <Bell className="h-4 w-4" aria-hidden />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-nutridex-primary px-1 text-xs font-extrabold text-white shadow-xs animate__animated animate__pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-3xl border border-nutridex-border bg-nutridex-surface p-4 shadow-2xl backdrop-blur-xl animate__animated animate__fadeIn animate__faster">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-nutridex-border/60">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-nutridex-text-primary">Notificaciones</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-nutridex-primary-soft px-2 py-0.5 text-xs font-bold text-nutridex-primary">
                  {unreadCount} nuevas
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs font-bold text-nutridex-primary hover:underline"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Marcar leídas</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="mt-3 max-h-80 overflow-y-auto no-scrollbar space-y-2">
            {loading && notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-nutridex-text-secondary">
                Cargando notificaciones...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center space-y-1">
                <Bell className="mx-auto h-8 w-8 text-nutridex-text-secondary/40" />
                <p className="text-xs font-bold text-nutridex-text-primary">No tienes notificaciones</p>
                <p className="text-xs text-nutridex-text-secondary">
                  Te avisaremos sobre tus metas y recetas recomendadas.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markOneRead(notif.id)}
                  className={`flex items-start gap-3 rounded-2xl p-3 transition-colors cursor-pointer ${
                    notif.is_read
                      ? "bg-nutridex-surface-muted/40 hover:bg-nutridex-surface-muted/80 opacity-75"
                      : "bg-nutridex-primary-soft/30 hover:bg-nutridex-primary-soft/50 border border-nutridex-primary/20"
                  }`}
                >
                  <div className="mt-0.5">{getTypeIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-extrabold text-nutridex-text-primary truncate">
                        {notif.title}
                      </h4>
                      {!notif.is_read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-nutridex-primary shrink-0" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-nutridex-text-secondary leading-snug">
                      {notif.message}
                    </p>
                    {notif.link_url && (
                      <Link
                        href={notif.link_url}
                        onClick={() => setIsOpen(false)}
                        className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-nutridex-primary hover:underline"
                      >
                        <span>Ver detalle</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="mt-3 pt-2.5 border-t border-nutridex-border/60 text-center">
            <Link
              href="/mi-plan"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-nutridex-text-secondary hover:text-nutridex-primary transition-colors"
            >
              Ir a mi plan semanal →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
