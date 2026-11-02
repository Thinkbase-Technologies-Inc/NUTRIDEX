"use client";

import { useState, useRef } from "react";
import { X, Upload, Check, Camera, Sparkles } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToast } from "@/components/ui/Toast";

export const DEFAULT_AVATARS = [
  {
    id: "avatar-1",
    label: "Emily Andrian",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "avatar-2",
    label: "Gleb Kuznetsov",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "avatar-3",
    label: "Alex Rivera",
    url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "avatar-4",
    label: "Sofia Chen",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "avatar-5",
    label: "Mateo Vargas",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "avatar-6",
    label: "Elena Rostova",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "avatar-7",
    label: "Marcus Thorne",
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "avatar-8",
    label: "Chloe Dupont",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
  },
];

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AvatarPickerModal({ isOpen, onClose }: AvatarPickerModalProps) {
  const { user, updateProfile } = useAuthStore();
  const { showToast } = useToast();
  const [selectedUrl, setSelectedUrl] = useState<string>(user?.avatarUrl ?? DEFAULT_AVATARS[0].url);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file upload with canvas optimization
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast({
        type: "error",
        title: "Archivo inválido",
        description: "Por favor selecciona una imagen (PNG, JPG, WebP).",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setSelectedUrl(dataUrl);
        showToast({
          type: "info",
          title: "Imagen cargada",
          description: "Vista previa lista. Pulsa 'Guardar avatar' para aplicar tus cambios.",
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      // 1. Update in database via API
      const res = await fetch("/api/neon/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          avatarUrl: selectedUrl,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Error al actualizar avatar");
      }

      // 2. Update local state
      updateProfile({ avatarUrl: selectedUrl });

      showToast({
        type: "success",
        title: "Avatar actualizado",
        description: "Tu nueva imagen de perfil se guardó correctamente en tu cuenta.",
      });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al guardar";
      // Still update locally for smooth offline fallback
      updateProfile({ avatarUrl: selectedUrl });
      showToast({
        type: "info",
        title: "Avatar guardado localmente",
        description: message,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate__animated animate__fadeIn animate__faster"
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-picker-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-nutridex-border bg-nutridex-surface p-6 shadow-2xl animate__animated animate__zoomIn animate__faster">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-nutridex-border/60">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-nutridex-primary" />
            <h2 id="avatar-picker-title" className="text-lg font-bold text-nutridex-text-primary">
              Elige tu foto de perfil
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-nutridex-surface-muted text-nutridex-text-secondary hover:text-nutridex-text-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Current Preview */}
        <div className="my-6 flex flex-col items-center justify-center gap-3">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-nutridex-primary shadow-lg group">
            <img src={selectedUrl} alt="Vista previa de avatar" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              title="Subir imagen"
            >
              <Upload className="h-6 w-6" />
            </button>
          </div>
          <p className="text-xs font-semibold text-nutridex-text-secondary">
            Vista previa seleccionada
          </p>
        </div>

        {/* Upload Custom Image Button */}
        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Subir foto desde tu dispositivo"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-nutridex-border bg-nutridex-surface-muted/50 p-3 text-xs sm:text-sm font-bold text-nutridex-text-primary hover:border-nutridex-primary hover:bg-nutridex-primary-soft/30 transition-all active:scale-98"
          >
            <Upload className="h-4 w-4 text-nutridex-primary" />
            <span>Subir imagen personalizada desde tu equipo</span>
          </button>
        </div>

        {/* Curated Default Avatars Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-nutridex-text-secondary">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-nutridex-cyan" />
              O elige un avatar profesional por defecto:
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-4">
            {DEFAULT_AVATARS.map((av) => {
              const isSelected = selectedUrl === av.url;
              return (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedUrl(av.url)}
                  className={`relative flex flex-col items-center gap-1.5 rounded-2xl p-2 transition-all active:scale-95 ${
                    isSelected
                      ? "bg-nutridex-primary-soft ring-2 ring-nutridex-primary shadow-xs"
                      : "bg-nutridex-surface-muted/60 hover:bg-nutridex-surface-muted"
                  }`}
                >
                  <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-xs">
                    <img src={av.url} alt={av.label} className="h-full w-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-nutridex-primary/60 text-white">
                        <Check className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-nutridex-text-primary truncate max-w-full">
                    {av.label.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-nutridex-border/60">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-nutridex-border px-4 py-2.5 text-xs font-bold text-nutridex-text-secondary hover:bg-nutridex-surface-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="rounded-2xl bg-nutridex-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-nutridex-primary-hover shadow-md active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {isSubmitting ? "Guardando..." : "Guardar avatar"}
          </button>
        </div>
      </div>
    </div>
  );
}
