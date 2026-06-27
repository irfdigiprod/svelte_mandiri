# Cara Membuat Svelte Mandiri — Tutorial Lengkap

Tutorial langkah demi langkah membangun aplikasi **Admin Panel** berbasis **Bun + Hono + DrizzleORM + MySQL** (backend) dan **SvelteKit + TailwindCSS** (frontend) secara mandiri tanpa bantuan AI.

---

## Daftar Isi

1. [Prasyarat & Instalasi Tools](#1-prasyarat--instalasi-tools)
2. [Struktur Project](#2-struktur-project)
3. [Backend — Hono API](#3-backend--hono-api)
   - [3.1 Inisialisasi Project](#31-inisialisasi-project)
   - [3.2 Konfigurasi Environment](#32-konfigurasi-environment)
   - [3.3 Koneksi Database (DrizzleORM)](#33-koneksi-database-drizzleorm)
   - [3.4 Schema Database](#34-schema-database)
   - [3.5 Migrasi Database](#35-migrasi-database)
   - [3.6 Types](#36-types)
   - [3.7 Validasi Schema (Zod)](#37-validasi-schema-zod)
   - [3.8 Utils](#38-utils)
   - [3.9 Middleware Validasi](#39-middleware-validasi)
   - [3.10 Middleware Autentikasi JWT](#310-middleware-autentikasi-jwt)
   - [3.11 Controllers](#311-controllers)
   - [3.12 Routes](#312-routes)
   - [3.13 Entry Point (index.ts)](#313-entry-point-indexts)
4. [Frontend — SvelteKit](#4-frontend--sveltekit)
   - [4.1 Inisialisasi Project](#41-inisialisasi-project)
   - [4.2 Konfigurasi Environment](#42-konfigurasi-environment)
   - [4.3 Layout Utama](#43-layout-utama)
   - [4.4 Halaman Login](#44-halaman-login)
   - [4.5 Halaman Register](#45-halaman-register)
   - [4.6 Halaman Admin (Protected Routes)](#46-halaman-admin-protected-routes)
   - [4.7 Halaman Dashboard](#47-halaman-dashboard)
   - [4.8 Halaman Users (CRUD)](#48-halaman-users-crud)
   - [4.9 Komponen Sidebar](#49-komponen-sidebar)
   - [4.10 Logout](#410-logout)
5. [Menjalankan Aplikasi](#5-menjalankan-aplikasi)
6. [Alur Data & Arsitektur](#6-alur-data--arsitektur)
7. [Tips & Troubleshooting](#7-tips--troubleshooting)
8. [Komponen DataTable (Reusable)](#8-komponen-datatable-reusable)
9. [Komponen ImportExcelModal (Reusable)](#9-komponen-importexcelmodal-reusable)

---

## 1. Prasyarat & Instalasi Tools

Pastikan tools berikut sudah terpasang di komputer Anda sebelum memulai:

### Bun (JavaScript Runtime)

Bun adalah runtime JavaScript yang lebih cepat dari Node.js. Digunakan untuk menjalankan backend.

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Verifikasi instalasi
bun --version
```

### MySQL

Database yang digunakan. Install via Homebrew (macOS) atau download dari mysql.com.

```bash
# macOS
brew install mysql
brew services start mysql

# Verifikasi
mysql --version
```

### Node.js (untuk frontend)

Frontend SvelteKit menggunakan Node/npm.

```bash
# Download dari https://nodejs.org (pilih LTS)
# Atau via nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts

# Verifikasi
node --version
npm --version
```

### Editor Kode

Gunakan **Visual Studio Code** dengan ekstensi:

- `Svelte for VS Code` — syntax highlighting Svelte
- `Tailwind CSS IntelliSense` — autocomplete Tailwind
- `ESLint` & `Prettier` — linting & formatting

---

## 2. Struktur Project

Kita akan membuat dua folder terpisah dalam satu root project:

```
svelte_mandiri/
├── backend-api/        ← Hono REST API (Bun runtime)
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── drizzle/        ← File migrasi SQL (auto-generated)
│   ├── drizzle.config.ts
│   ├── package.json
│   └── .env
│
└── frontend-svelte/    ← SvelteKit Admin Panel
    ├── src/
    │   ├── components/
    │   ├── lib/
    │   └── routes/
    │       ├── admin/
    │       │   ├── dashboard/
    │       │   ├── users/
    │       │   ├── profile/
    │       │   └── change-password/
    │       ├── login/
    │       ├── register/
    │       └── logout/
    ├── package.json
    └── .env
```

---

## 3. Backend — Hono API

### 3.1 Inisialisasi Project

```bash
# Buat folder root project
mkdir svelte_mandiri
cd svelte_mandiri

# Buat folder backend
mkdir backend-api
cd backend-api

# Inisialisasi project Bun
bun init -y

# Install dependensi
bun add hono drizzle-orm mysql2 zod dotenv
bun add -d drizzle-kit @types/bun tsx
```

Isi `package.json` setelah install:

```json
{
  "name": "backend-api",
  "scripts": {
    "dev": "bun run --hot src/index.ts"
  },
  "dependencies": {
    "dotenv": "^17.0.0",
    "drizzle-orm": "^0.45.0",
    "hono": "^4.12.0",
    "mysql2": "^3.22.0",
    "zod": "^4.0.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "drizzle-kit": "^0.31.0",
    "tsx": "^4.0.0"
  }
}
```

### 3.2 Konfigurasi Environment

Buat file `backend-api/.env`:

```env
DATABASE_URL="mysql://root:PASSWORD@localhost:3306/db_mandiri"
JWT_SECRET=buat_secret_random_yang_panjang_minimal_32_karakter
```

> **Catatan:** Ganti `PASSWORD` dengan password MySQL Anda. Jika tidak ada password, hapus saja `PASSWORD@` menjadi `root:@localhost`.

Buat database di MySQL:

```sql
-- Jalankan di MySQL CLI atau phpMyAdmin
CREATE DATABASE db_mandiri;
```

Buat file `backend-api/drizzle.config.ts`:

```typescript
import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### 3.3 Koneksi Database (DrizzleORM)

Buat file `backend-api/src/db/index.ts`:

```typescript
import { drizzle } from "drizzle-orm/mysql2";
import * as mysql from "mysql2/promise";
import "dotenv/config";

// Setup connection pool
const connectionPool = mysql.createPool(process.env.DATABASE_URL!);

export const db = drizzle(connectionPool);
```

### 3.4 Schema Database

Buat file `backend-api/src/db/schema.ts`:

```typescript
import { mysqlTable, serial, varchar, timestamp } from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
```

### 3.5 Migrasi Database

```bash
# Generate file SQL dari schema
cd backend-api
bunx drizzle-kit generate

# Push / jalankan migrasi ke database
bunx drizzle-kit migrate
```

> DrizzleORM akan membuat folder `drizzle/` berisi file SQL dan otomatis menjalankan migrasi tersebut ke MySQL.

### 3.6 Types

Buat file `backend-api/src/types/auth.ts`:

```typescript
export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  username: string;
  email: string;
  password: string;
};
```

Buat file `backend-api/src/types/user.ts`:

```typescript
export type UserCreateRequest = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type UserUpdaterequest = {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
};
```

### 3.7 Validasi Schema (Zod)

Buat file `backend-api/src/schemas/auth.schema.ts`:

```typescript
import { z } from "zod";

// Skema untuk registrasi
export const registerSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(100),
  username: z
    .string()
    .trim()
    .min(3, "Username minimal 3 karakter")
    .max(32)
    .regex(/^[a-z0-9_]+$/i, "Username hanya huruf, angka, dan underscore"),
  email: z.string().trim().toLowerCase().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").max(128),
});

// Skema untuk login
export const loginSchema = z.object({
  username: z.string().trim().toLowerCase().min(3).max(32),
  password: z.string().min(6),
});
```

Buat file `backend-api/src/schemas/user.schema.ts`:

```typescript
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(100),
  username: z
    .string()
    .trim()
    .min(3, "Username minimal 3 karakter")
    .max(32)
    .regex(/^[a-z0-9_]+$/i, "Username hanya huruf, angka, dan underscore"),
  email: z.string().trim().toLowerCase().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").max(128),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  username: z
    .string()
    .trim()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9_]+$/i)
    .optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  password: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().min(6).max(128).optional(),
  ),
  currentPassword: z.string().optional(),
});
```

### 3.8 Utils

Buat file `backend-api/src/utils/validation.ts`:

```typescript
import { ZodError } from "zod";

// Mengubah error Zod menjadi objek key-value yang mudah dikonsumsi frontend
export function formatZodErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    errors[key] = issue.message;
  }
  return errors;
}
```

### 3.9 Middleware Validasi

Buat file `backend-api/src/middlewares/validate.middleware.ts`:

```typescript
import { z } from "zod";
import type { MiddlewareHandler } from "hono";
import { formatZodErrors } from "../utils/validation";

export function validateBody<T extends z.ZodTypeAny>(
  schema: T,
): MiddlewareHandler {
  return async (c, next) => {
    // Wajib Content-Type: application/json
    const ct = c.req.header("content-type") || "";
    if (!ct.toLowerCase().includes("application/json")) {
      return c.json({ success: false, message: "Use application/json" }, 415);
    }

    // Parse body
    let raw: unknown;
    try {
      raw = await c.req.json();
    } catch {
      return c.json({ success: false, message: "Invalid JSON payload" }, 400);
    }

    // Validasi dengan Zod
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message: "Validation Failed!",
          errors: formatZodErrors(parsed.error),
        },
        422,
      );
    }

    // Simpan data tervalidasi agar bisa diakses controller
    c.set("validatedBody", parsed.data);
    await next();
  };
}
```

### 3.10 Middleware Autentikasi JWT

Buat file `backend-api/src/middlewares/auth.middleware.ts`:

```typescript
import type { MiddlewareHandler } from "hono";
import { verify } from "hono/jwt";

export const verifyToken: MiddlewareHandler = async (c, next) => {
  // Ambil header Authorization
  const header =
    c.req.header("Authorization") || c.req.header("authorization") || "";

  // Dukung format "Bearer xxx" atau token mentah
  const token = header.startsWith("Bearer ")
    ? header.slice(7).trim()
    : header.trim();

  if (!token) {
    return c.json({ message: "Unauthenticated." }, 401);
  }

  try {
    const secret = process.env.JWT_SECRET || "default";
    // Verifikasi token dengan algoritma HS256
    const payload = await verify(token, secret, "HS256");
    // Simpan userId ke context
    const userId = (payload as any).id ?? (payload as any).sub;
    c.set("userId", userId);
    await next();
  } catch {
    return c.json({ message: "Invalid token" }, 401);
  }
};
```

### 3.11 Controllers

**Register Controller** — `backend-api/src/controllers/registerController.ts`:

```typescript
import type { Context } from "hono";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq, or } from "drizzle-orm";
import type { RegisterRequest } from "../types/auth";

export const register = async (c: Context) => {
  try {
    const { name, username, email, password } = c.get(
      "validatedBody",
    ) as RegisterRequest;

    // Cek duplikat email atau username
    const existing = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        username: usersTable.username,
      })
      .from(usersTable)
      .where(or(eq(usersTable.email, email), eq(usersTable.username, username)))
      .limit(1);

    if (existing[0]) {
      const field = existing[0].email === email ? "email" : "username";
      return c.json(
        {
          success: false,
          message:
            field === "email"
              ? "Email sudah terdaftar"
              : "Username sudah digunakan",
          errors: { [field]: "Telah digunakan" },
        },
        409,
      );
    }

    // Hash password dengan Bun (Argon2id by default)
    const hashedPassword = await Bun.password.hash(password);

    // Simpan user baru
    await db
      .insert(usersTable)
      .values({ name, username, email, password: hashedPassword });

    return c.json({ success: true, message: "Registrasi berhasil!" }, 201);
  } catch (e) {
    console.error(e);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};
```

**Login Controller** — `backend-api/src/controllers/loginController.ts`:

```typescript
import type { Context } from "hono";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import type { LoginRequest } from "../types/auth";
import { sign } from "hono/jwt";

export const login = async (c: Context) => {
  try {
    const { username, password } = c.get("validatedBody") as LoginRequest;

    // Cari user berdasarkan username
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    const user = users[0];

    if (!user) {
      return c.json({ success: false, message: "User tidak ditemukan" }, 401);
    }

    // Verifikasi password
    const isValid = user.password
      ? await Bun.password.verify(password, user.password)
      : false;

    if (!isValid) {
      return c.json({ success: false, message: "Password salah" }, 401);
    }

    // Buat JWT token (expire 1 jam)
    const payload = {
      sub: user.id,
      username: user.username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };
    const secret = process.env.JWT_SECRET || "default";
    const token = await sign(payload, secret);

    // Hapus password dari data yang dikembalikan
    const { password: _, ...userData } = user;

    return c.json(
      {
        success: true,
        message: "Login Berhasil!",
        data: { user: userData, token },
      },
      200,
    );
  } catch {
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};
```

**User Controller** — `backend-api/src/controllers/userController.ts`:

> Lihat file `src/controllers/userController.ts` di repository untuk kode lengkap CRUD. Fungsi yang dibuat: `getUsers`, `createUser`, `getUserById`, `updateUser`, `deleteUser`.

Poin penting pada `updateUser`:

- Jika user mengubah passwordnya sendiri, wajib mengirim `currentPassword`
- `currentPassword` diverifikasi dengan `Bun.password.verify()` sebelum password baru disimpan
- Password baru di-hash dengan `Bun.password.hash()` (Argon2id)

### 3.12 Routes

Buat file `backend-api/src/routes/index.ts`:

```typescript
import { Hono } from "hono";
import { validateBody } from "../middlewares/validate.middleware";
import { verifyToken } from "../middlewares/auth.middleware";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";
import { register } from "../controllers/registerController";
import { login } from "../controllers/loginController";
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = new Hono();

// Auth routes (publik)
router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

// User routes (protected — butuh JWT token)
router.get("/users", verifyToken, getUsers);
router.post("/users", verifyToken, validateBody(createUserSchema), createUser);
router.get("/users/:id", verifyToken, getUserById);
router.put(
  "/users/:id",
  verifyToken,
  validateBody(updateUserSchema),
  updateUser,
);
router.delete("/users/:id", verifyToken, deleteUser);

export const Routes = router;
```

### 3.13 Entry Point (index.ts)

Buat file `backend-api/src/index.ts`:

```typescript
import { Hono } from "hono";
import { cors } from "hono/cors";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { db } from "./db";
import { Routes } from "./routes";

// Jalankan migrasi otomatis saat startup
async function runMigrations() {
  try {
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations completed!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

runMigrations();

// Buat instance Hono dengan base path /api
const app = new Hono().basePath("/api");

// Aktifkan CORS untuk semua endpoint
app.use("*", cors());

// Daftarkan semua routes
app.route("/", Routes);

export default app;
```

---

## 4. Frontend — SvelteKit

### 4.1 Inisialisasi Project

```bash
# Kembali ke root project
cd svelte_mandiri

# Buat project SvelteKit
npx sv create frontend-svelte
# Pilihan: SvelteKit minimal, TypeScript: yes, Tailwind: yes

cd frontend-svelte

# Install dependensi
npm install

# Atau dengan bun (lebih cepat)
bun install
```

### 4.2 Konfigurasi Environment

Buat file `frontend-svelte/.env`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

> `VITE_BACKEND_URL` adalah URL server backend. Variabel yang diawali `VITE_` otomatis tersedia di kode Svelte client-side maupun server-side.

### 4.3 Layout Utama

File `src/routes/+layout.svelte` adalah layout global yang membungkus semua halaman.

**Struktur layout:**

- Deteksi apakah URL dimulai dengan `/admin` → tampilkan sidebar admin
- Jika bukan `/admin` → tampilkan navbar sederhana (untuk halaman login/register)
- Sidebar admin memiliki dua kolom: kolom ikon kecil (category switcher) + kolom menu

**Fitur yang diimplementasi di layout:**

1. **Category Switcher** — 4 ikon di kolom kiri (Apps, Charts, Settings, Security) mengubah isi menu panel
2. **Profile Dropdown** — klik avatar di header → tampilkan menu Profile, Ganti Password, Logout
3. **Mobile Sidebar** — sidebar bisa ditarik keluar/masuk di layar kecil (responsive)
4. **Data User** — nama dan email user diambil dari cookie `user` via `page.data.user`

**Pola pengambilan data user:**

```typescript
// src/routes/admin/+layout.server.ts
export async function load({ cookies }) {
  const userData = cookies.get("user");
  return {
    user: userData ? JSON.parse(userData) : null,
  };
}
```

Data ini kemudian tersedia di semua halaman admin via `page.data.user`.

### 4.4 Halaman Login

**`src/routes/login/+page.server.ts`** — menangani form login di sisi server:

```typescript
import { fail } from "@sveltejs/kit";

export const actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    // Kirim ke backend API
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        success: false,
        message: result.message,
        errors: result.errors || {},
      });
    }

    // Simpan token & data user di cookie (httpOnly = aman dari JavaScript)
    cookies.set("token", result.data.token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1 jam
    });
    cookies.set("user", JSON.stringify(result.data.user), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60,
    });

    return { success: true };
  },
};
```

**`src/routes/login/+page.svelte`** — tampilan form login dengan feedback error.

### 4.5 Halaman Register

Sama dengan login, tapi mengirim `name`, `username`, `email`, `password` ke endpoint `/api/register`.

### 4.6 Halaman Admin (Protected Routes)

Semua halaman di dalam `src/routes/admin/` membutuhkan autentikasi. Proteksi dilakukan dengan mengecek cookie `token` di setiap `+page.server.ts`:

```typescript
// Contoh di src/routes/admin/users/+page.server.ts
export async function load({ fetch, cookies }) {
  const token = cookies.get("token");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const result = await response.json();
  return { users: result.data || [] };
}
```

> **Pola penting:** Token JWT yang tersimpan di cookie dikirim sebagai header `Authorization` ke backend. Backend kemudian memverifikasi token di `verifyToken` middleware.

### 4.7 Halaman Dashboard

File `src/routes/admin/dashboard/+page.svelte` — halaman sederhana yang menampilkan pesan selamat datang dengan nama dan username user yang sedang login.

### 4.8 Halaman Users (CRUD)

**`src/routes/admin/users/+page.server.ts`** — load data dan handle actions:

```typescript
export const actions = {
  // Hapus satu user
  delete: async ({ request, cookies }) => {
    const formData = await request.formData();
    const id = formData.get("id");
    const token = cookies.get("token");

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `${token}` },
    });

    return { success: true };
  },

  // Hapus banyak user sekaligus (batch delete)
  deleteSelected: async ({ request, cookies }) => {
    const formData = await request.formData();
    const ids = JSON.parse(formData.get("ids")!.toString());
    const token = cookies.get("token");

    for (const id of ids) {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `${token}` },
      });
    }

    return { success: true };
  },
};
```

**`src/routes/admin/users/+page.svelte`** — fitur-fitur yang diimplementasi:

| Fitur                 | Cara Kerja                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| **Toggle Card/Table** | State `viewMode` ('table' \| 'card'), render kondisional                                       |
| **Search**            | State `searchQuery`, filter `data.users` secara reaktif via `$derived`                         |
| **Filter Gender**     | State `genderFilter`, filter berdasarkan ID genap/ganjil (karena tidak ada kolom gender di DB) |
| **Pagination**        | State `currentPage` dan `pageSize`, slice array `filteredUsers`                                |
| **Select All**        | State `selectedIds`, computed `isAllSelected`                                                  |
| **Batch Delete**      | Form submit `deleteSelected` action dengan `enhance`                                           |

### 4.9 Komponen Sidebar

**`src/components/SidebarMenu.svelte`** menerima prop `category` dari layout:

```svelte
<script lang="ts">
  let { category = 'apps' }: { category: string } = $props();

  // Setiap kategori memiliki menu list tersendiri
  const appsMenuItems = [ /* Dashboard, Users, Santri, dst */ ];
  const settingsMenuItems = [ /* Pengaturan Umum, Role, dst */ ];
  const chartsMenuItems = [ /* Laporan, Statistik, dst */ ];
  const securityMenuItems = [ /* Log Aktivitas, Sesi, dst */ ];

  // Pilih menu sesuai kategori aktif
  let menuItems = $derived.by(() => {
    if (category === 'charts') return chartsMenuItems;
    if (category === 'settings') return settingsMenuItems;
    if (category === 'security') return securityMenuItems;
    return appsMenuItems;
  });
</script>
```

**Fitur sidebar:**

- **Accordion** — menu dengan sub-item bisa dibuka/tutup
- **Active State** — menu yang aktif diberi highlight kuning `bg-[#f9c74f]`
- **Search** — filter menu secara realtime berdasarkan input
- **Category Switcher** — prop `category` menentukan set menu yang ditampilkan

### 4.10 Logout

Logout menggunakan SvelteKit server endpoint, bukan halaman biasa.

**`src/routes/logout/+server.ts`**:

```typescript
import type { RequestHandler } from "./$types";
import { redirect } from "@sveltejs/kit";

export const GET: RequestHandler = ({ cookies }) => {
  // Hapus cookie token dan user
  cookies.delete("token", { path: "/" });
  cookies.delete("user", { path: "/" });
  // Redirect ke halaman login
  throw redirect(302, "/login");
};
```

**Di layout, link logout menggunakan `data-sveltekit-reload`:**

```html
<a href="/logout" data-sveltekit-reload>Logout</a>
```

> Atribut `data-sveltekit-reload` memastikan SvelteKit melakukan full page reload ke `/logout`, sehingga server endpoint benar-benar dipanggil (bukan client-side navigation).

---

## 5. Menjalankan Aplikasi

### Jalankan Backend

```bash
cd backend-api
bun run dev
# Server berjalan di http://localhost:3000
# API tersedia di http://localhost:3000/api
```

### Jalankan Frontend

```bash
cd frontend-svelte
bun run dev
# atau
npm run dev
# Frontend berjalan di http://localhost:5173
```

### Urutan yang Benar

1. Pastikan MySQL berjalan
2. Jalankan backend terlebih dahulu (migrasi akan otomatis berjalan)
3. Jalankan frontend
4. Buka browser ke `http://localhost:5173`
5. Register akun baru, lalu login

---

## 6. Alur Data & Arsitektur

```
BROWSER
  │
  │  1. User isi form login
  ▼
SvelteKit Server (+page.server.ts)
  │
  │  2. Kirim POST /api/login ke backend
  ▼
Hono API (backend-api)
  │
  │  3. Middleware validasi Zod → cek format data
  │  4. loginController → cek username di MySQL via Drizzle
  │  5. Bun.password.verify() → cek password
  │  6. sign() → buat JWT token
  │
  │  7. Return token + data user
  ▼
SvelteKit Server
  │
  │  8. Simpan token di cookie httpOnly
  │  9. Simpan data user di cookie httpOnly
  │
  ▼
BROWSER
  │
  │  10. Redirect ke /admin/dashboard
  │  11. Sidebar render, ambil user dari cookie
  │
  ▼
Admin Panel (tampil di browser)
```

**Mengapa cookie httpOnly?**
Cookie `httpOnly` tidak bisa diakses JavaScript di browser, sehingga token aman dari serangan XSS (Cross-Site Scripting). Token dikirim secara otomatis oleh browser ke server setiap request.

---

## 7. Tips & Troubleshooting

### Error: Cannot connect to database

```bash
# Pastikan MySQL berjalan
brew services start mysql  # macOS

# Cek koneksi manual
mysql -u root -p -e "SHOW DATABASES;"
```

### Error: JWT invalid

- Pastikan `JWT_SECRET` di `.env` backend dan `.env.local` (jika ada) sudah sama
- Token expire setelah 1 jam — coba logout dan login ulang

### Error: CORS

Pastikan di `backend-api/src/index.ts` terdapat:

```typescript
app.use("*", cors());
```

Dan CORS dipasang **sebelum** routes didaftarkan.

### Error: Migrations failed

```bash
# Reset dan generate ulang
cd backend-api
bunx drizzle-kit drop   # hapus semua tabel (hati-hati di production!)
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

### Frontend tidak terhubung ke backend

- Pastikan `VITE_BACKEND_URL` di `frontend-svelte/.env` mengarah ke URL backend yang benar
- Pastikan backend berjalan terlebih dahulu sebelum frontend

### Svelte check error

```bash
cd frontend-svelte
bun run check
# Baca pesan error dan perbaiki sesuai petunjuk
```

---

## Teknologi yang Digunakan

| Teknologi       | Versi | Fungsi                                 |
| --------------- | ----- | -------------------------------------- |
| **Bun**         | ≥1.0  | JavaScript runtime untuk backend       |
| **Hono**        | ^4.12 | Web framework backend (ringan & cepat) |
| **DrizzleORM**  | ^0.45 | ORM untuk query MySQL                  |
| **MySQL2**      | ^3.22 | Driver MySQL untuk Node/Bun            |
| **Zod**         | ^4.0  | Validasi schema input                  |
| **SvelteKit**   | ^2.63 | Full-stack framework frontend          |
| **Svelte**      | ^5.0  | UI framework (reactive)                |
| **TailwindCSS** | ^4.3  | Utility-first CSS framework            |
| **TypeScript**  | ^6.0  | Type safety untuk JavaScript           |

---

_Selamat! Anda kini bisa membangun aplikasi ini secara mandiri. Mulailah dari backend (setup DB → schema → controller → routes), lalu lanjutkan ke frontend (layout → halaman login → halaman admin)._

---

<a id="8-komponen-datatable-reusable"></a>

## 8. Komponen DataTable (Reusable)

Komponen **`DataTable`** digunakan untuk menampilkan daftar data dalam bentuk tabel maupun grid kartu secara dinamis, lengkap dengan pencarian, pemilahan baris per halaman, pagination, filter kustom, serta aksi massal (bulk actions).

### Lokasi Impor

```typescript
import DataTable from "$components/DataTable.svelte";
// Atau jika menggunakan absolute/relative path:
import DataTable from "../../../components/DataTable.svelte";
```

### Properti (Props) & Bindings

| Properti             | Tipe                                      | Deskripsi                                                                          |
| :------------------- | :---------------------------------------- | :--------------------------------------------------------------------------------- |
| `items`              | `any[]`                                   | Array data yang telah difilter oleh komponen induk (misal hasil search/filter).    |
| `totalItemsCount`    | `number`                                  | Jumlah keseluruhan data sebelum difilter (untuk penunjuk _"Showing X to Y of Z"_). |
| `columns`            | `Column[]`                                | Array berisi struktur kolom `{ key: string, label: string, class?: string }`.      |
| `selectedIds`        | `any[]` (bindable)                        | Array untuk menampung ID baris yang dicentang (dipilih).                           |
| `searchQuery`        | `string` (bindable)                       | String kueri pencarian yang diikat ke kolom input pencarian.                       |
| `pageSize`           | `'5' \| '10' \| '50' \| 'All'` (bindable) | Jumlah item per halaman.                                                           |
| `currentPage`        | `number` (bindable)                       | Halaman aktif saat ini.                                                            |
| `viewMode`           | `'table' \| 'card'` (bindable)            | Mode tampilan tabel (`table`) atau grid kartu (`card`).                            |
| `searchPlaceholder`  | `string` (opsional)                       | Placeholder untuk input teks pencarian. Default: `"Cari..."`.                      |
| `filterLabel`        | `string` (opsional)                       | Label tombol filter dropdown. Default: `"Filter"`.                                 |
| `filterDropdownOpen` | `boolean` (bindable)                      | Mengatur status buka/tutup dropdown filter.                                        |

### Snippets Pendukung (Svelte 5)

Komponen ini memanfaatkan **Snippets** untuk memberikan kendali kustomisasi markup 100% kepada file induk:

1. **`{#snippet filterOptions()}`**
   Merender konten dropdown filter (opsional).
2. **`{#snippet row(item, isSelected, toggleSelect)}`**
   Merender baris tubuh tabel `<tr>`. Menerima 3 argumen: objek `item`, boolean `isSelected`, dan fungsi pemicu centang `toggleSelect`.
3. **`{#snippet card(item, isSelected, toggleSelect)}`**
   Merender tampilan grid kartu saat `viewMode === 'card'`.
4. **`{#snippet batchActions(selectedCount, clearSelection)}`**
   Merender baris tombol aksi kolektif saat ada baris yang dipilih (misal: tombol hapus massal).

---

### Contoh Implementasi Lengkap (Halaman Produk)

Berikut adalah contoh lengkap cara membuat halaman admin data **Produk** menggunakan `DataTable.svelte`:

````html
<script lang="ts">
	import DataTable from '../../../components/DataTable.svelte';
	import { invalidateAll } from '$app/navigation';

	// 1. Data mentah dari loader (+page.server.ts)
	let { data } = $props();

	// 2. State DataTable
	let searchQuery = $state('');
	let categoryFilter = $state('Semua');
	let filterDropdownOpen = $state(false);

	let viewMode = $state<'table' | 'card'>('table');
	let pageSize = $state<'5' | '10' | '50' | 'All'>('10');
	let currentPage = $state(1);
	let selectedIds = $state<number[]>([]);

	// 3. Logika Filter data produk di parent
	let filteredProducts = $derived(
		data.products?.filter((p: any) => {
			const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			                      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = categoryFilter === 'Semua' || p.category === categoryFilter;
			return matchesSearch && matchesCategory;
		}) || []
	);

	function handleBulkDelete() {
		alert(`Menghapus ${selectedIds.length} produk terpilih`);
		selectedIds = []; // clear selection
	}
</script>

<!-- Dropdown opsi filter kategori -->
{#snippet filterOptions()}
	{#each ['Semua', 'Elektronik', 'Pakaian', 'Makanan'] as cat}
		<button
			onclick={() => {
				categoryFilter = cat;
				filterDropdownOpen = false;
			}}
			class="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 transition-colors {categoryFilter === cat ? 'text-amber-500 font-bold' : 'text-slate-600'}"
		>
			{cat}
		</button>
	{/each}
{/snippet}

<!-- Rendering baris tabel kustom -->
{#snippet row(product: any, isSelected: boolean, toggleSelect: () => void)}
	<tr class="hover:bg-slate-50/50 transition-colors {isSelected ? 'bg-amber-50/20' : ''}">
		<td class="px-6 py-4 text-center">
			<input type="checkbox" checked={isSelected} onchange={toggleSelect} class="rounded border-slate-300 text-amber-500 focus:ring-amber-400" />
		</td>
		<td class="px-6 py-4 font-bold text-slate-800">{product.name}</td>
		<td class="px-6 py-4 text-slate-500 font-mono">{product.sku}</td>
		<td class="px-6 py-4 text-slate-600">{product.category}</td>
		<td class="px-6 py-4 font-bold text-emerald-600">Rp {product.price.toLocaleString('id-ID')}</td>
		<td class="px-6 py-4 text-center">
			<a href="/admin/products/edit/{product.id}" class="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg">EDIT</a>
		</td>
	</tr>
{/snippet}

<!-- Rendering grid kartu kustom -->
{#snippet card(product: any, isSelected: boolean, toggleSelect: () => void)}
	<div class="bg-white border rounded-2xl p-5 relative hover:border-amber-400 transition-all {isSelected ? 'border-amber-400 bg-amber-50/10' : 'border-slate-200'}">
		<div class="flex items-center justify-between mb-3">
			<input type="checkbox" checked={isSelected} onchange={toggleSelect} class="rounded text-amber-500" />
			<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">{product.category}</span>
		</div>
		<h3 class="font-bold text-slate-800 text-sm truncate">{product.name}</h3>
		<p class="text-xs text-slate-400 font-mono mt-1">{product.sku}</p>
		<p class="font-bold text-emerald-600 text-xs mt-3">Rp {product.price.toLocaleString('id-ID')}</p>
	</div>
{/snippet}

<!-- Tombol aksi massal -->
{#snippet batchActions(selectedCount: number, clearSelection: () => void)}
	<button onclick={handleBulkDelete} class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
		Hapus Terpilih ({selectedCount})
	</button>
{/snippet}

<!-- Pasang DataTable -->
<div class="p-6">
	<DataTable
		items={filteredProducts}
		totalItemsCount={data.products?.length || 0}
		columns={[
			{ key: 'name', label: 'Nama Produk' },
			{ key: 'sku', label: 'SKU' },
			{ key: 'category', label: 'Kategori' },
			{ key: 'price', label: 'Harga' },
			{ key: 'actions', label: 'Aksi', class: 'text-center w-24' }
		]}
		bind:selectedIds
		bind:searchQuery
		bind:pageSize
		bind:currentPage
		bind:viewMode
		bind:filterDropdownOpen
		filterLabel="Kategori: {categoryFilter}"
		{filterOptions}
		{row}
		{card}
		{batchActions}
	/>
</div>

---

<a id="9-komponen-importexcelmodal-reusable"></a>

```

## 9. Komponen ImportExcelModal (Reusable)

Komponen **`ImportExcelModal`** adalah modal berfitur lengkap untuk melakukan proses impor data massal dari file Excel (format `.csv`). Komponen ini dirancang secara elegan untuk meminimalkan beban di database dengan melakukan validasi awal secara penuh di sisi klien.

### Lokasi Impor

```typescript
import ImportExcelModal from "$components/ImportExcelModal.svelte";
import ImportExcelModal from "../../../components/ImportExcelModal.svelte";
```

### Properti (Props) & Bindings

| Properti        | Tipe                          | Deskripsi                                                                 |
| :-------------- | :---------------------------- | :------------------------------------------------------------------------ |
| `show`          | `boolean` (bindable)          | Status tampil/sembunyi modal.                                             |
| `existingUsers` | `any[]`                       | Array user aktif dari database (untuk validasi duplikasi email/username). |
| `onSuccess`     | `() => Promise<void> \| void` | Callback asinkronus yang dipanggil setelah seluruh data berhasil diimpor. |

---

### Alur Kerja Interaktif (3-Step Stepper)

Komponen ini membagi proses impor menjadi 3 fase terpadu:

```
[1. Unggah] ───> [2. Review & Validasi] ───> [3. Proses Data]
```

#### Tahap 1: Unggah File

- **Fungsi**: Pengguna dapat menyeret & menjatuhkan file CSV ke dalam area drop zone, atau mengkliknya untuk memilih file.
- **Template Unduhan**: Terdapat tombol **Unduh Template** yang menghasilkan file CSV dengan struktur header kolom standar berikut:
  ```csv
  Nama,Username (Email),Email,Password
  ```

#### Tahap 2: Review (Pencarian, Pagination & Validasi)

Setelah file berhasil diunggah, parser CSV internal akan membaca file secara realtime dan melakukan validasi komprehensif:

- **Deteksi Sel Kosong**: Memastikan kolom wajib (`Nama`, `Username`, `Email`, `Password`) tidak dibiarkan kosong.
- **Format Email**: Memeriksa kecocokan alamat email menggunakan Regex standar.
- **Validasi Duplikasi Internal**: Mendeteksi jika terdapat baris data dengan email atau username kembar di dalam file CSV yang sama.
- **Validasi Duplikasi Database**: Mencocokkan data CSV terhadap prop `existingUsers` untuk memastikan email belum terdaftar di database.
- **Kekuatan Sandi**: Memastikan password minimal memiliki panjang 6 karakter.

**Fitur Kontrol di Layar Review:**

- **Pencarian Realtime**: Pengguna dapat mencari data spesifik berdasarkan nama, email, atau error tertentu.
- **Paginasi Grid**: Pilihan baris halaman: `5`, `10`, `20`, `50`, dan `All`.
- **Tampilan Fleksibel**: Toggle view antara **Tabel** (scrolling horizontal) dan **Kartu**.
- **Penanda Error Visual**: Data tidak valid akan diwarnai merah dengan deskripsi error yang sangat spesifik, sedangkan data valid ditandai badge hijau `"VALID"`.

#### Tahap 3: Proses (Progress Ring Melingkar Hijau)

- **Progress Dinamis**: Saat tombol proses diklik, modal menampilkan indikator persentase memutar berbentuk lingkaran hijau (menggunakan visual SVG stroke-dasharray).
- **Pengiriman Batch**: Hanya baris berstatus **VALID** yang dikirim secara asinkron ke server untuk disimpan di database.
- **Hasil Akhir**: Setelah selesai, modal menampilkan ringkasan jumlah data yang **Berhasil diimpor** dan data yang **Gagal/Dilewati**.

---

### Contoh Implementasi Lengkap (Halaman Users)

Berikut adalah contoh pemanggilan `ImportExcelModal` pada file induk Svelte:

```html
<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import ImportExcelModal from "../../../components/ImportExcelModal.svelte";

  let { data } = $props();
  let showImportModal = $state(false);

  async function handleSuccess() {
    // Segarkan data halaman agar tabel induk menampilkan user baru
    await invalidateAll();
  }
</script>

<!-- Tombol pemicu buka modal -->
<button onclick="{()" ="">
  (showImportModal = true)} class="px-5 py-3 text-xs font-bold bg-white
  hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl flex
  items-center gap-2" > 📥 Import Excel/CSV
</button>

<!-- Komponen Import Excel -->
<ImportExcelModal
  bind:show="{showImportModal}"
  existingUsers="{data.users}"
  onSuccess="{handleSuccess}"
/>
```

---

### Cara Modifikasi untuk Struktur Data Lain

Jika Anda ingin menggunakan komponen ini untuk struktur data berbeda (misalnya impor data **Produk**), ikuti langkah kustomisasi berikut pada salinan file komponen Anda:

1. **Ubah String Template CSV** pada fungsi `downloadTemplate()`:
   ```typescript
   const csvContent =
     "data:text/csv;charset=utf-8,Nama Produk,SKU,Kategori,Harga\nLaptop Asus,LAP-ASUS-01,Elektronik,15000000\n";
   ```
2. **Sesuaikan Logika Pemetaan Kolom** pada fungsi `processParsedLines(lines)`:
   ```typescript
   const nameIndex = headers.findIndex((h) => h.includes("nama"));
   const skuIndex = headers.findIndex((h) => h.includes("sku"));
   // Tambahkan pengecekan validasi kustom (misal: format SKU, harga minimal)
   ```
3. **Ubah Endpoint POST** pada fungsi `startImport()` untuk mengirim data ke endpoint produk Anda:
   ```typescript
   const response = await fetch("/admin/products/create?/create", {
     method: "POST",
     body: formData,
   });
   ```

---

> [!TIP]
> **Tips Validasi Impor**: Komponen `ImportExcelModal` secara otomatis membandingkan isian kolom `Username (Email)` dan `Email` dalam file CSV terhadap daftar email yang dikirim lewat prop `existingUsers`. Pastikan prop `existingUsers` selalu terisi dengan data pengguna terbaru dari database Anda untuk memastikan review duplikasi berjalan akurat di sisi klien sebelum data dikirim ke server.
