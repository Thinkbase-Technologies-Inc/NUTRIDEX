/**
 * src/repositories/indexeddb.ts
 *
 * Persistencia de planes alimenticios mediante IndexedDB con esquemas
 * versionados y migraciones. Lectura segura ante esquemas antiguos y errores.
 */

import type { MealPlan, UserPreferences } from "@/types";
import { MealPlanSchema, StoredBackupSchema, UserPreferencesSchema } from "@/types/schema";

const DB_NAME = "NutriDex";
const DB_VERSION = 2;
const PLANS_STORE = "plans";
const BACKUPS_STORE = "backups";

type Db = IDBDatabase;

let dbInstance: Db | null = null;

function openDB(): Promise<Db> {
  if (dbInstance) return Promise.resolve(dbInstance);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = req.result as Db;
      if (!db.objectStoreNames.contains(PLANS_STORE)) {
        db.createObjectStore(PLANS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(BACKUPS_STORE)) {
        db.createObjectStore(BACKUPS_STORE, { keyPath: "id" });
      }
    };

    req.onsuccess = () => {
      dbInstance = req.result as Db;
      dbInstance.onversionchange = () => {
        dbInstance?.close();
        dbInstance = null;
      };
      resolve(dbInstance);
    };

    req.onerror = () => reject(req.error);
    req.onblocked = () => {
      // Permitir que otras pestañas actualicen la versión.
    };
  });
}

export async function getDb(): Promise<Db> {
  return openDB();
}

export async function closeDb(): Promise<void> {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

export async function savePlan(plan: MealPlan): Promise<void> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([PLANS_STORE], "readwrite");
    const store = tx.objectStore(PLANS_STORE);
    const valid = MealPlanSchema.safeParse(plan);
    if (!valid.success) {
      reject(new Error("Plan inválido para persistencia"));
      return;
    }
    const req = store.put(valid.data);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getPlan(id: string): Promise<MealPlan | null> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([PLANS_STORE], "readonly");
    const store = tx.objectStore(PLANS_STORE);
    const req = store.get(id);
    req.onsuccess = () => resolve((req.result as MealPlan | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllPlans(): Promise<MealPlan[]> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([PLANS_STORE], "readonly");
    const store = tx.objectStore(PLANS_STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const plans = (req.result as MealPlan[]).filter((p) =>
        MealPlanSchema.safeParse(p).success
      );
      resolve(plans);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deletePlan(id: string): Promise<void> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([PLANS_STORE], "readwrite");
    const store = tx.objectStore(PLANS_STORE);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function saveBackup(backup: { id: string; data: unknown }): Promise<void> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([BACKUPS_STORE], "readwrite");
    const store = tx.objectStore(BACKUPS_STORE);
    const req = store.put({ id: backup.id, data: backup.data, createdAt: new Date().toISOString() });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getBackup(id: string): Promise<unknown | null> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([BACKUPS_STORE], "readonly");
    const store = tx.objectStore(BACKUPS_STORE);
    const req = store.get(id);
    req.onsuccess = () => resolve((req.result as { data: unknown } | undefined)?.data ?? null);
    req.onerror = () => reject(req.error);
  });
}

/**
 * localStorage preferencias ligeras (tema, configuración).
 * Hidratación segura: solo se lee en cliente.
 */

export const STORAGE_KEYS = {
  preferences: "nutridex:preferences",
  favorites: "nutridex:favorites",
  theme: "nutridex:theme",
  onboarding: "nutridex:onboarding",
};

export function readPreferences(): UserPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.preferences);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const result = UserPreferencesSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function writePreferences(prefs: UserPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(prefs));
  } catch {
    // Silencioso ante cuota excedida o modo privado.
  }
}

export function readTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.theme);
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
  } catch {}
  return "system";
}

export function writeTheme(mode: ThemeMode): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.theme, mode);
  } catch {}
}

export type ThemeMode = "light" | "dark" | "system";

export function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.favorites);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function writeFavorites(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(ids));
  } catch {}
}

export function readOnboarding(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEYS.onboarding) === "true";
  } catch {
    return false;
  }
}

export function writeOnboarding(value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.onboarding, value ? "true" : "false");
  } catch {}
}

export function clearAllUserData(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEYS.preferences);
    localStorage.removeItem(STORAGE_KEYS.favorites);
    localStorage.removeItem(STORAGE_KEYS.theme);
    localStorage.removeItem(STORAGE_KEYS.onboarding);
  } catch {}
  if (dbInstance) {
    const tx = dbInstance.transaction([PLANS_STORE, BACKUPS_STORE], "readwrite");
    tx.objectStore(PLANS_STORE).clear();
    tx.objectStore(BACKUPS_STORE).clear();
  }
}
