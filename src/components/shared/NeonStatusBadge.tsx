"use client";

import { useEffect, useState } from "react";
import { Cloud, CheckCircle2, AlertCircle } from "lucide-react";

interface CloudHealthData {
  status: "connected" | "error" | "unconfigured";
  branch?: string;
  latencyMs?: number;
  database?: string;
  tables?: string[];
  stats?: {
    foodsCount: number;
    favoritesCount: number;
  };
}

export function NeonStatusBadge({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<CloudHealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/neon/health")
      .then((res) => res.json())
      .then((json) => {
        if (mounted) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setData({ status: "error" });
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div
        className="flex items-center gap-1.5 rounded-full bg-nutridex-surface-muted/60 px-2.5 py-1 text-xs font-semibold text-nutridex-text-secondary border border-nutridex-border"
        title="Conectando con la nube de ThinkBase..."
      >
        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="hidden sm:inline">Conectando...</span>
      </div>
    );
  }

  const isConnected = data?.status === "connected";

  if (compact) {
    return (
      <div
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${
          isConnected
            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
            : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
        }`}
        title={`Nube ThinkBase · ${data?.latencyMs ? `${data.latencyMs} ms de respuesta` : "En línea"}`}
      >
        <span
          className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500 shadow-xs" : "bg-amber-500"}`}
        />
        <Cloud className="h-3 w-3" aria-hidden />
        <span className="hidden lg:inline">
          {isConnected ? "Nube Activa" : "Modo Local"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border p-3 text-xs sm:text-sm font-semibold transition-all ${
        isConnected
          ? "border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200"
          : "border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200"
      }`}
    >
      {isConnected ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            {isConnected ? "Sincronización en la Nube Activa" : "Modo Local sin Conexión"}
          </span>
          {data?.latencyMs && (
            <span className="text-xs text-nutridex-text-secondary font-mono">
              {data.latencyMs} ms de latencia
            </span>
          )}
        </div>
        <p className="text-xs text-nutridex-text-secondary mt-0.5 truncate">
          Servicio: <span className="font-medium text-nutridex-text-primary">ThinkBase Cloud</span> · {data?.stats?.foodsCount ?? 0} alimentos sincronizados · Tiempo real habilitado
        </p>
      </div>
    </div>
  );
}
