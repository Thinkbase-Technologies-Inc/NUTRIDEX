"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Plus,
  Check,
  Trash2,
  Copy,
  Sparkles,
  CheckCheck,
  CalendarDays,
  ShoppingBag,
} from "lucide-react";
import {
  useShoppingStore,
  SHOPPING_DEPARTMENTS,
  type ShoppingItem,
} from "@/stores/useShoppingStore";
import { usePlannerStore } from "@/stores/usePlannerStore";
import { useToast } from "@/components/ui/Toast";

export default function ListaComprasPage() {
  const {
    items,
    isLoading,
    addItem,
    toggleItem,
    removeItem,
    clearPurchased,
    clearAll,
    generateFromPlanner,
    syncFromNeon,
  } = useShoppingStore();

  const { plans } = usePlannerStore();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState<string>(SHOPPING_DEPARTMENTS[0]);
  const [itemQuantity, setItemQuantity] = useState("");

  useEffect(() => {
    syncFromNeon();
  }, [syncFromNeon]);

  const purchasedCount = items.filter((i) => i.is_purchased).length;
  const progressPercent =
    items.length > 0 ? Math.round((purchasedCount / items.length) * 100) : 0;

  // Group by department
  const groupedItems = SHOPPING_DEPARTMENTS.reduce<Record<string, ShoppingItem[]>>(
    (acc, dept) => {
      acc[dept] = items.filter((i) => i.category === dept);
      return acc;
    },
    {}
  );

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    await addItem(itemName, itemCategory, itemQuantity || "1 porción");
    showToast({
      type: "success",
      title: "Artículo agregado",
      description: `"${itemName}" se añadió a tu lista de compras.`,
    });

    setItemName("");
    setItemQuantity("");
    setIsModalOpen(false);
  };

  const handleGenerateFromPlan = async () => {
    const added = await generateFromPlanner(plans);
    if (added > 0) {
      showToast({
        type: "success",
        title: "Lista generada",
        description: `Se agregaron ${added} ingredientes de tu plan semanal.`,
      });
    } else {
      showToast({
        type: "info",
        title: "Lista al día",
        description: "Todos los ingredientes de tu plan ya están en tu lista.",
      });
    }
  };

  const handleCopyList = () => {
    if (items.length === 0) return;

    const text = SHOPPING_DEPARTMENTS.map((dept) => {
      const deptItems = groupedItems[dept];
      if (!deptItems || deptItems.length === 0) return null;

      const itemsStr = deptItems
        .map((i) => `${i.is_purchased ? "✓ [COMPRADO]" : "○"} ${i.item_name} (${i.quantity})`)
        .join("\n");

      return `== ${dept.toUpperCase()} ==\n${itemsStr}`;
    })
      .filter(Boolean)
      .join("\n\n");

    const fullMessage = `🛒 LISTA DE COMPRAS NUTRIDEX\n\n${text}\n\nCreado con NutriDex by ThinkBase`;
    navigator.clipboard.writeText(fullMessage);

    showToast({
      type: "success",
      title: "Lista copiada",
      description: "Tu lista se copió al portapapeles para compartir o imprimir.",
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 md:px-8 md:py-8 space-y-7 animate__animated animate__fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-nutridex-primary text-white shadow-xs">
              <ShoppingCart className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-nutridex-primary">
              Despensa Inteligente
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-nutridex-text-primary">
            Lista del Súper
          </h1>
          <p className="text-xs sm:text-sm text-nutridex-text-secondary">
            Organiza tus compras automáticamente a partir de tus planes semanales y recetas favoritas.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleGenerateFromPlan}
            className="flex items-center gap-1.5 rounded-2xl border border-nutridex-border bg-nutridex-surface px-4 py-2.5 text-xs font-bold text-nutridex-text-primary hover:bg-nutridex-surface-muted transition-colors shadow-xs"
          >
            <CalendarDays className="h-3.5 w-3.5 text-nutridex-primary" />
            <span>Generar del plan</span>
          </button>

          <button
            type="button"
            onClick={handleCopyList}
            disabled={items.length === 0}
            className="flex items-center gap-1.5 rounded-2xl border border-nutridex-border bg-nutridex-surface px-4 py-2.5 text-xs font-bold text-nutridex-text-primary hover:bg-nutridex-surface-muted transition-colors shadow-xs disabled:opacity-50"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copiar</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-nutridex-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-nutridex-primary-hover shadow-md active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar artículo</span>
          </button>
        </div>
      </div>

      {/* Progress & Summary Bar */}
      <div className="nx-card p-5 sm:p-6 space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-nutridex-text-secondary">
              Avance en tu carrito
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-nutridex-text-primary">
                {purchasedCount}{" "}
                <span className="text-base font-semibold text-nutridex-text-secondary">
                  de {items.length} artículos comprados
                </span>
              </span>
            </div>
          </div>

          <span className="text-sm font-black text-nutridex-primary">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 w-full rounded-full bg-nutridex-surface-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-nutridex-primary to-emerald-400 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {purchasedCount > 0 && (
          <div className="flex items-center justify-end pt-1">
            <button
              type="button"
              onClick={clearPurchased}
              className="text-xs font-bold text-nutridex-text-secondary hover:text-rose-500 transition-colors"
            >
              Limpiar artículos comprados
            </button>
          </div>
        )}
      </div>

      {/* Grocery Items by Departments */}
      {items.length === 0 ? (
        <div className="nx-card p-12 text-center space-y-4">
          <ShoppingBag className="mx-auto h-12 w-12 text-nutridex-text-secondary/40" />
          <h3 className="text-base font-bold text-nutridex-text-primary">
            Tu lista del súper está vacía
          </h3>
          <p className="text-xs text-nutridex-text-secondary max-w-sm mx-auto">
            Puedes generar tu lista automáticamente con los alimentos de tu plan semanal o agregar productos manualmente.
          </p>
          <button
            type="button"
            onClick={handleGenerateFromPlan}
            className="inline-flex items-center gap-2 rounded-2xl bg-nutridex-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-nutridex-primary-hover shadow-sm"
          >
            <CalendarDays className="h-4 w-4" />
            <span>Generar desde mis planes</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {SHOPPING_DEPARTMENTS.map((dept) => {
            const deptItems = groupedItems[dept];
            if (!deptItems || deptItems.length === 0) return null;

            return (
              <div key={dept} className="nx-card p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-nutridex-border/60 pb-3">
                  <h3 className="text-sm sm:text-base font-extrabold text-nutridex-text-primary">
                    {dept}
                  </h3>
                  <span className="text-xs font-bold text-nutridex-text-secondary">
                    {deptItems.length} {deptItems.length === 1 ? "artículo" : "artículos"}
                  </span>
                </div>

                <div className="divide-y divide-nutridex-border/40">
                  {deptItems.map((item) => (
                    <div
                      key={item.id}
                      className="py-3 flex items-center justify-between gap-3 group"
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="flex items-center gap-3.5 flex-1 min-w-0 text-left"
                      >
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all ${
                            item.is_purchased
                              ? "border-emerald-500 bg-emerald-500 text-white shadow-xs"
                              : "border-nutridex-border bg-nutridex-surface hover:border-nutridex-primary"
                          }`}
                        >
                          {item.is_purchased && <Check className="h-4 w-4 stroke-[3]" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-semibold transition-all truncate ${
                              item.is_purchased
                                ? "line-through text-nutridex-text-secondary/60"
                                : "text-nutridex-text-primary"
                            }`}
                          >
                            {item.item_name}
                          </p>
                          <p className="text-xs text-nutridex-text-secondary">
                            {item.quantity}
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-nutridex-text-secondary hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        title="Eliminar artículo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal to Add Custom Item */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-3xl border border-nutridex-border bg-nutridex-surface p-6 shadow-2xl animate__animated animate__zoomIn">
            <h3 className="text-lg font-bold text-nutridex-text-primary">
              Agregar a la Lista del Súper
            </h3>
            <p className="text-xs text-nutridex-text-secondary mt-1">
              Ingresa el nombre del producto, departamento y cantidad necesaria.
            </p>

            <form onSubmit={handleAddItem} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-nutridex-text-secondary uppercase mb-1">
                  Nombre del artículo *
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Ej. Espinacas baby frescas"
                  className="w-full rounded-2xl border border-nutridex-border bg-nutridex-surface px-4 py-2.5 text-sm font-semibold text-nutridex-text-primary focus:border-nutridex-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-nutridex-text-secondary uppercase mb-1">
                  Departamento / Categoría
                </label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full rounded-2xl border border-nutridex-border bg-nutridex-surface px-4 py-2.5 text-xs font-bold text-nutridex-text-primary focus:border-nutridex-primary focus:outline-none"
                >
                  {SHOPPING_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-nutridex-text-secondary uppercase mb-1">
                  Cantidad o Porción
                </label>
                <input
                  type="text"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(e.target.value)}
                  placeholder="Ej. 1 domo (250 g)"
                  className="w-full rounded-2xl border border-nutridex-border bg-nutridex-surface px-4 py-2 text-xs font-medium focus:border-nutridex-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-2xl border border-nutridex-border px-4 py-2 text-xs font-bold text-nutridex-text-secondary hover:bg-nutridex-surface-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-nutridex-primary px-5 py-2 text-xs font-bold text-white hover:bg-nutridex-primary-hover shadow-md active:scale-95"
                >
                  Agregar artículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
