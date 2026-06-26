import { Hono } from "hono";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { db } from "./db";

// Fungsi untuk menjalankan migrasi otomatis
async function runMigrations() {
  try {
    console.log("Running migrations...");
    // Menjalankan migrasi dari folder './drizzle'
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Jalankan migrasi saat startup
runMigrations();

// Instansiasi Hono
const app = new Hono().basePath("/api");

// import cors bawaan dari Hono
import { cors } from "hono/cors";

// Gunakan routes
import { Routes } from "./routes";
// aktifkan CORS middleware untuk semua endpoint
app.use("*", cors());
app.route("/", Routes);

export default app;
