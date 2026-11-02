import { neon, neonConfig } from "@neondatabase/serverless";
import type { FoodItem, MealPlan } from "@/types";

// Suppress browser environment warning when running in test runners (happy-dom/jsdom)
neonConfig.disableWarningInBrowsers = true;

/**
 * Neon Postgres database client for NutriDex.
 * Utilizes connection pooling via DATABASE_URL for optimal serverless performance.
 */
export function getDb() {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
  if (!url) {
    throw new Error(
      "Neon DATABASE_URL is not configured. Ensure `neon deploy` was executed and .env.local is loaded."
    );
  }
  return neon(url);
}

/**
 * Returns whether Neon database environment is configured.
 */
export function isNeonConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED);
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  avatar_url: string;
  target_calories: number;
  target_equivalents: number;
  plan_name: string;
  created_at: string;
  updated_at: string;
}

export interface RecipeRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  prep_time_mins: number;
  calories_kcal: number;
  servings: number;
  image_url: string;
  category: string;
  portion_info: string;
  ingredients: string[];
  instructions: string[];
  created_at: string;
}

export interface NotificationRow {
  id: string;
  user_email: string;
  title: string;
  message: string;
  type: "info" | "success" | "alert" | "plan";
  is_read: boolean;
  link_url?: string;
  created_at: string;
}

const DEFAULT_USERS_SEED: Array<Omit<UserRow, "created_at" | "updated_at">> = [
  {
    id: "user-emily",
    name: "Emily Andrian",
    email: "emily.andrian@thinkbase.app",
    password_hash: "demo123",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
    target_calories: 1820,
    target_equivalents: 14,
    plan_name: "Plan Activo · ThinkBase",
  },
  {
    id: "user-gleb",
    name: "Gleb Kuznetsov",
    email: "gleb.kuznetsov@thinkbase.app",
    password_hash: "gleb123",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
    target_calories: 2200,
    target_equivalents: 16,
    plan_name: "Plans Meals · Pro",
  },
];

const DEFAULT_RECIPES_SEED: Omit<RecipeRow, "created_at">[] = [
  {
    id: "receta-smoothie-berry",
    slug: "high-protein-berry-smoothie-bowl",
    title: "High Protein Berry Smoothie Bowl",
    description: "Tazón refrescante de frutos rojos silvestres con proteína vegetal, chía, plátano y fresas frescas.",
    prep_time_mins: 10,
    calories_kcal: 320,
    servings: 1,
    image_url: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80",
    category: "Desayuno",
    portion_info: "1 fruta + 1 lácteo + 1 cereal",
    ingredients: [
      "1 taza de fresas y frambuesas congeladas",
      "1/2 taza de leche de almendras o descremada",
      "1 scoop de proteína vegetal o suero",
      "1 cucharada de semillas de chía",
      "1/3 taza de avena tostada para topping",
    ],
    instructions: [
      "Coloca los frutos congelados, la leche y la proteína en la licuadora.",
      "Procesa a velocidad alta hasta lograr textura espesa y cremosa.",
      "Vierte en un tazón hondo.",
      "Decora con la avena crujiente, chía y fruta fresca en rebanadas.",
    ],
  },
  {
    id: "receta-avena-manzana",
    slug: "bowl-de-avena-caliente-con-manzana",
    title: "Bowl de Avena con Manzana y Canela",
    description: "Desayuno reconfortante rico en fibra soluble y antioxidantes, con manzana fresca picada y toque de canela.",
    prep_time_mins: 8,
    calories_kcal: 280,
    servings: 1,
    image_url: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80",
    category: "Desayuno",
    portion_info: "1/3 taza de avena (30 g) + 1 manzana (106 g)",
    ingredients: [
      "1/3 taza de avena en hojuelas cruda",
      "3/4 taza de agua o leche",
      "1 pieza de manzana picada en cubos",
      "1 pizca de canela molida de Ceilán",
      "1 cucharadita de miel pura de abeja",
    ],
    instructions: [
      "En una olla pequeña, calienta el agua o leche a fuego medio.",
      "Agrega las hojuelas de avena y cocina 4 minutos revolviendo suavemente.",
      "Añade la mitad de los cubos de manzana y la canela.",
      "Sirve en tazón y corona con el resto de la manzana crujiente y miel.",
    ],
  },
  {
    id: "receta-salad-chicken",
    slug: "mix-salad-chicken-aguacate",
    title: "Mix Salad Chicken con Aguacate Hass",
    description: "Ensalada verde crujiente con pechuga de pollo marinada a las finas hierbas y aguacate cremoso.",
    prep_time_mins: 15,
    calories_kcal: 440,
    servings: 1,
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    category: "Comida",
    portion_info: "1 proteina baja en grasa + 1 grasa con proteína + verduras libres",
    ingredients: [
      "120 g de pechuga de pollo a la plancha en tiras",
      "1/3 pieza de aguacate Hass en rebanadas",
      "2 tazas de espinaca baby y lechugas mixtas",
      "1/2 taza de pepino y jitomate cherry",
      "1 cucharadita de aceite de oliva extravirgen y limón",
    ],
    instructions: [
      "Sella la pechuga a fuego medio-alto con sal y pimienta 6 min por lado.",
      "Lava y corta los vegetales en un tazón amplio.",
      "Coloca el pollo rebanado y el aguacate encima.",
      "Adereza con aceite de oliva y jugo de limón fresco.",
    ],
  },
  {
    id: "receta-tostadas-guacamole",
    slug: "tostadas-de-maiz-con-guacamole",
    title: "Tostadas Horneadas con Guacamole y Huevo",
    description: "Colación saciante y balanceada con tostadas de maíz crujientes, puré de aguacate y huevo pochado.",
    prep_time_mins: 10,
    calories_kcal: 290,
    servings: 1,
    image_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
    category: "Snack",
    portion_info: "2 cereales sin grasa + 1 grasa + 1 proteína",
    ingredients: [
      "2 piezas de tostadas de maíz horneadas sin grasa",
      "1/3 pieza de aguacate machacado con limón y sal",
      "1 huevo cocido o pochado",
      "Hojuelas de chile seco y semillas de sésamo",
    ],
    instructions: [
      "Unta el guacamole fresco sobre las tostadas de maíz.",
      "Corta el huevo a la mitad y colócalo sobre cada tostada.",
      "Espolvorea semillas y chile al gusto.",
    ],
  },
];

/**
 * Ensures required database tables exist in Neon Lakebase Postgres.
 */
export async function initDatabase() {
  const db = getDb();
  const branch = process.env.NEON_BRANCH || "production";

  // 1. System status & health table
  await db`
    CREATE TABLE IF NOT EXISTS nutridex_system_status (
      id TEXT PRIMARY KEY,
      branch TEXT NOT NULL,
      connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  await db`
    INSERT INTO nutridex_system_status (id, branch, updated_at)
    VALUES ('healthcheck', ${branch}, NOW())
    ON CONFLICT (id) DO UPDATE
    SET branch = EXCLUDED.branch, updated_at = NOW();
  `;

  // 2. Users table (Login, Register, Profiles)
  await db`
    CREATE TABLE IF NOT EXISTS nutridex_users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT NOT NULL,
      target_calories INTEGER DEFAULT 2000,
      target_equivalents INTEGER DEFAULT 14,
      plan_name TEXT DEFAULT 'Plan Personal · ThinkBase',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  // Seed default demo users if none exist
  for (const user of DEFAULT_USERS_SEED) {
    await db`
      INSERT INTO nutridex_users (
        id, name, email, password_hash, avatar_url, target_calories, target_equivalents, plan_name
      )
      VALUES (
        ${user.id}, ${user.name}, ${user.email.toLowerCase()}, ${user.password_hash},
        ${user.avatar_url}, ${user.target_calories}, ${user.target_equivalents}, ${user.plan_name}
      )
      ON CONFLICT (email) DO NOTHING;
    `;
  }

  // 3. Food catalog table
  await db`
    CREATE TABLE IF NOT EXISTS nutridex_foods (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      name TEXT NOT NULL,
      normalized_name TEXT,
      group_id TEXT NOT NULL,
      portion_label TEXT NOT NULL,
      grams NUMERIC,
      is_approximate BOOLEAN DEFAULT FALSE,
      source_page INTEGER DEFAULT 0,
      validation_status TEXT DEFAULT 'verified',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  await db`ALTER TABLE nutridex_foods ADD COLUMN IF NOT EXISTS normalized_name TEXT;`;
  await db`ALTER TABLE nutridex_foods ADD COLUMN IF NOT EXISTS source_page INTEGER DEFAULT 0;`;
  await db`ALTER TABLE nutridex_foods ADD COLUMN IF NOT EXISTS validation_status TEXT DEFAULT 'verified';`;

  // 4. User favorites table
  await db`
    CREATE TABLE IF NOT EXISTS nutridex_favorites (
      id SERIAL PRIMARY KEY,
      user_email TEXT NOT NULL,
      food_id TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT unq_user_food UNIQUE (user_email, food_id)
    );
  `;

  // 5. Meal plans table (Daily plans by user and date)
  await db`
    CREATE TABLE IF NOT EXISTS nutridex_meal_plans (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      date TEXT NOT NULL,
      plan_data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  await db`ALTER TABLE nutridex_meal_plans ADD COLUMN IF NOT EXISTS date TEXT;`;
  await db`ALTER TABLE nutridex_meal_plans ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Plan Diario';`;
  await db`ALTER TABLE nutridex_meal_plans ALTER COLUMN title DROP NOT NULL;`;
  await db`CREATE UNIQUE INDEX IF NOT EXISTS unq_user_plan_date_idx ON nutridex_meal_plans (user_email, date);`;

  // 6. Recetas table
  await db`
    CREATE TABLE IF NOT EXISTS nutridex_recetas (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      prep_time_mins INTEGER NOT NULL DEFAULT 15,
      calories_kcal INTEGER NOT NULL DEFAULT 350,
      servings INTEGER NOT NULL DEFAULT 1,
      image_url TEXT NOT NULL,
      category TEXT NOT NULL,
      portion_info TEXT NOT NULL,
      ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
      instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  // Seed default recipes
  for (const r of DEFAULT_RECIPES_SEED) {
    await db`
      INSERT INTO nutridex_recetas (
        id, slug, title, description, prep_time_mins, calories_kcal, servings, image_url, category, portion_info, ingredients, instructions
      )
      VALUES (
        ${r.id}, ${r.slug}, ${r.title}, ${r.description}, ${r.prep_time_mins}, ${r.calories_kcal},
        ${r.servings}, ${r.image_url}, ${r.category}, ${r.portion_info},
        ${JSON.stringify(r.ingredients)}, ${JSON.stringify(r.instructions)}
      )
      ON CONFLICT (slug) DO NOTHING;
    `;
  }

  // 7. Notificaciones table
  await db`
    CREATE TABLE IF NOT EXISTS nutridex_notificaciones (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'info',
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      link_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  // Seed welcome notification
  const welcomeId = "notif-welcome-emily";
  await db`
    INSERT INTO nutridex_notificaciones (id, user_email, title, message, type, is_read, link_url)
    VALUES (
      ${welcomeId},
      'emily.andrian@thinkbase.app',
      '¡Bienvenido a NutriDex!',
      'Tu cuenta y tus planes ahora están sincronizados en tiempo real en la nube.',
      'success',
      false,
      '/mi-plan'
    )
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      message = EXCLUDED.message;
  `;

  // Clean any old messages that referenced database internals
  await db`
    UPDATE nutridex_notificaciones
    SET message = REPLACE(message, 'con Neon Lakebase Postgres', 'en la nube')
    WHERE message LIKE '%Neon%';
  `;

  // 8. History / Calculator records
  await db`
    CREATE TABLE IF NOT EXISTS nutridex_history (
      id SERIAL PRIMARY KEY,
      user_email TEXT NOT NULL,
      action_type TEXT NOT NULL,
      details JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  return { success: true, branch };
}

/**
 * Checks Neon database health, measures roundtrip latency, and gathers stats.
 */
export async function getNeonHealth() {
  const startTime = Date.now();
  const db = getDb();

  const [versionRes, tablesRes, favoritesCountRes, foodsCountRes, usersCountRes, plansCountRes] =
    await Promise.all([
      db`SELECT version(), current_database(), current_user, NOW() as server_time;`,
      db`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `,
      db`SELECT count(*)::int as count FROM nutridex_favorites;`,
      db`SELECT count(*)::int as count FROM nutridex_foods;`,
      db`SELECT count(*)::int as count FROM nutridex_users;`,
      db`SELECT count(*)::int as count FROM nutridex_meal_plans;`,
    ]);

  const latencyMs = Date.now() - startTime;
  const versionInfo = versionRes[0] as {
    version: string;
    current_database: string;
    current_user: string;
    server_time: string;
  };

  return {
    status: "connected",
    latencyMs,
    branch: process.env.NEON_BRANCH || "production",
    database: versionInfo.current_database,
    user: versionInfo.current_user,
    serverTime: versionInfo.server_time,
    postgresVersion: versionInfo.version,
    tables: tablesRes.map((t) => (t as { table_name: string }).table_name),
    stats: {
      foodsCount: (foodsCountRes[0] as { count: number })?.count ?? 0,
      favoritesCount: (favoritesCountRes[0] as { count: number })?.count ?? 0,
      usersCount: (usersCountRes[0] as { count: number })?.count ?? 0,
      plansCount: (plansCountRes[0] as { count: number })?.count ?? 0,
    },
  };
}

// --------------------------------------------------------------------------
// Auth Services (Users)
// --------------------------------------------------------------------------

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const db = getDb();
  const rows = await db`
    SELECT * FROM nutridex_users WHERE email = ${email.toLowerCase().trim()} LIMIT 1;
  `;
  if (rows.length === 0) return null;
  return rows[0] as UserRow;
}

export async function getAllUsers(): Promise<UserRow[]> {
  const db = getDb();
  const rows = await db`
    SELECT * FROM nutridex_users ORDER BY name ASC;
  `;
  return rows as UserRow[];
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
}): Promise<UserRow> {
  const db = getDb();
  const id = `user-${Date.now()}`;
  const rows = await db`
    INSERT INTO nutridex_users (id, name, email, password_hash, avatar_url)
    VALUES (${id}, ${data.name.trim()}, ${data.email.toLowerCase().trim()}, ${data.passwordHash}, ${data.avatarUrl})
    RETURNING *;
  `;
  return rows[0] as UserRow;
}

export async function updateUserProfileInNeon(
  email: string,
  updates: Partial<Omit<UserRow, "id" | "email" | "created_at">>
): Promise<UserRow> {
  const db = getDb();
  const normalizedEmail = email.toLowerCase().trim();

  const current = await findUserByEmail(normalizedEmail);
  if (!current) throw new Error("Usuario no encontrado");

  const name = updates.name ?? current.name;
  const avatarUrl = updates.avatar_url ?? current.avatar_url;
  const targetCalories = updates.target_calories ?? current.target_calories;
  const targetEquivalents = updates.target_equivalents ?? current.target_equivalents;
  const planName = updates.plan_name ?? current.plan_name;

  const rows = await db`
    UPDATE nutridex_users
    SET 
      name = ${name},
      avatar_url = ${avatarUrl},
      target_calories = ${targetCalories},
      target_equivalents = ${targetEquivalents},
      plan_name = ${planName},
      updated_at = NOW()
    WHERE email = ${normalizedEmail}
    RETURNING *;
  `;
  return rows[0] as UserRow;
}

// --------------------------------------------------------------------------
// Meal Plans
// --------------------------------------------------------------------------

export async function getMealPlansFromNeon(userEmail: string): Promise<MealPlan[]> {
  const db = getDb();
  const rows = await db`
    SELECT plan_data 
    FROM nutridex_meal_plans 
    WHERE user_email = ${userEmail.toLowerCase().trim()}
    ORDER BY date DESC;
  `;
  return rows.map((r) => (r as { plan_data: MealPlan }).plan_data);
}

export async function upsertMealPlanInNeon(userEmail: string, plan: MealPlan) {
  const db = getDb();
  const email = userEmail.toLowerCase().trim();
  const id = plan.id || `plan_${plan.date}`;

  await db`
    INSERT INTO nutridex_meal_plans (id, user_email, date, title, plan_data, updated_at)
    VALUES (${id}, ${email}, ${plan.date}, 'Plan Diario', ${JSON.stringify(plan)}, NOW())
    ON CONFLICT (id) DO UPDATE
    SET 
      user_email = EXCLUDED.user_email,
      date = EXCLUDED.date,
      title = EXCLUDED.title,
      plan_data = EXCLUDED.plan_data,
      updated_at = NOW();
  `;
  return { success: true };
}

export async function deleteMealPlanFromNeon(userEmail: string, date: string) {
  const db = getDb();
  await db`
    DELETE FROM nutridex_meal_plans
    WHERE user_email = ${userEmail.toLowerCase().trim()} AND date = ${date};
  `;
  return { success: true };
}

// --------------------------------------------------------------------------
// Recetas
// --------------------------------------------------------------------------

export async function getRecipesFromNeon(category?: string, search?: string): Promise<RecipeRow[]> {
  const db = getDb();
  let rows = await db`
    SELECT * FROM nutridex_recetas ORDER BY created_at ASC;
  `;

  let results = rows as RecipeRow[];
  if (category && category !== "Todas") {
    results = results.filter((r) => r.category.toLowerCase() === category.toLowerCase());
  }
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    results = results.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }
  return results;
}

export async function getRecipeBySlugFromNeon(slug: string): Promise<RecipeRow | null> {
  const db = getDb();
  const rows = await db`
    SELECT * FROM nutridex_recetas WHERE slug = ${slug} LIMIT 1;
  `;
  if (rows.length === 0) return null;
  return rows[0] as RecipeRow;
}

// --------------------------------------------------------------------------
// Notificaciones
// --------------------------------------------------------------------------

export async function getNotificationsFromNeon(userEmail: string): Promise<NotificationRow[]> {
  const db = getDb();
  const rows = await db`
    SELECT * FROM nutridex_notificaciones
    WHERE user_email = ${userEmail.toLowerCase().trim()}
    ORDER BY created_at DESC;
  `;
  return rows as NotificationRow[];
}

export async function markNotificationReadInNeon(id: string, userEmail: string) {
  const db = getDb();
  await db`
    UPDATE nutridex_notificaciones
    SET is_read = TRUE
    WHERE id = ${id} AND user_email = ${userEmail.toLowerCase().trim()};
  `;
  return { success: true };
}

export async function markAllNotificationsReadInNeon(userEmail: string) {
  const db = getDb();
  await db`
    UPDATE nutridex_notificaciones
    SET is_read = TRUE
    WHERE user_email = ${userEmail.toLowerCase().trim()};
  `;
  return { success: true };
}

export async function createNotificationInNeon(
  userEmail: string,
  title: string,
  message: string,
  type: "info" | "success" | "alert" | "plan" = "info",
  linkUrl?: string
) {
  const db = getDb();
  const id = `notif-${Date.now()}`;
  await db`
    INSERT INTO nutridex_notificaciones (id, user_email, title, message, type, is_read, link_url)
    VALUES (${id}, ${userEmail.toLowerCase().trim()}, ${title}, ${message}, ${type}, FALSE, ${linkUrl ?? null});
  `;
  return { success: true, id };
}

// --------------------------------------------------------------------------
// History / Calculations Log
// --------------------------------------------------------------------------

export async function logCalculationToNeon(
  userEmail: string,
  actionType: string,
  details: Record<string, unknown>
) {
  const db = getDb();
  await db`
    INSERT INTO nutridex_history (user_email, action_type, details)
    VALUES (${userEmail.toLowerCase().trim()}, ${actionType}, ${JSON.stringify(details)});
  `;
  return { success: true };
}

// --------------------------------------------------------------------------
// Foods & Favorites Catalog
// --------------------------------------------------------------------------

export async function syncFoodsToNeon(foods: FoodItem[]) {
  const db = getDb();
  let inserted = 0;

  for (const food of foods) {
    await db`
      INSERT INTO nutridex_foods (
        id, slug, name, normalized_name, group_id, portion_label, grams, is_approximate, source_page, validation_status
      )
      VALUES (
        ${food.id}, ${food.slug}, ${food.name}, ${food.normalizedName}, ${food.groupId},
        ${food.portionLabel}, ${food.grams}, ${food.isApproximate}, ${food.sourcePage}, ${food.validationStatus}
      )
      ON CONFLICT (id) DO UPDATE
      SET
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        normalized_name = EXCLUDED.normalized_name,
        group_id = EXCLUDED.group_id,
        portion_label = EXCLUDED.portion_label,
        grams = EXCLUDED.grams,
        is_approximate = EXCLUDED.is_approximate,
        source_page = EXCLUDED.source_page,
        validation_status = EXCLUDED.validation_status;
    `;
    inserted++;
  }

  return { success: true, count: inserted };
}

export async function getFoodsFromNeon(): Promise<FoodItem[]> {
  const db = getDb();
  const rows = await db`
    SELECT id, slug, name, normalized_name, group_id, portion_label, grams, is_approximate, source_page, validation_status
    FROM nutridex_foods
    ORDER BY name ASC;
  `;

  return rows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      id: String(row.id),
      slug: String(row.slug),
      name: String(row.name),
      normalizedName: String(row.normalized_name ?? row.name),
      aliases: [],
      groupId: String(row.group_id),
      portionLabel: String(row.portion_label),
      portionNumerator: null,
      portionDenominator: null,
      portionUnit: null,
      grams: row.grams != null ? Number(row.grams) : null,
      isApproximate: Boolean(row.is_approximate),
      sourcePage: Number(row.source_page ?? 0),
      sourceText: "",
      validationStatus: (row.validation_status as FoodItem["validationStatus"]) ?? "verified",
      notes: null,
    };
  });
}

export async function getUserFavoritesFromNeon(userEmail: string): Promise<string[]> {
  const db = getDb();
  const rows = await db`
    SELECT food_id 
    FROM nutridex_favorites 
    WHERE user_email = ${userEmail.toLowerCase().trim()}
    ORDER BY created_at DESC;
  `;
  return rows.map((r) => (r as { food_id: string }).food_id);
}

export async function addUserFavoriteToNeon(userEmail: string, foodId: string) {
  const db = getDb();
  await db`
    INSERT INTO nutridex_favorites (user_email, food_id)
    VALUES (${userEmail.toLowerCase().trim()}, ${foodId})
    ON CONFLICT (user_email, food_id) DO NOTHING;
  `;
  return { success: true };
}

export async function removeUserFavoriteFromNeon(userEmail: string, foodId: string) {
  const db = getDb();
  await db`
    DELETE FROM nutridex_favorites 
    WHERE user_email = ${userEmail.toLowerCase().trim()} AND food_id = ${foodId};
  `;
  return { success: true };
}
