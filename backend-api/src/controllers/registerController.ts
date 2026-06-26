// import type Context dari Hono
import type { Context } from "hono";

// import db and schema
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq, or } from "drizzle-orm";

// import type RegisterRequest
import type { RegisterRequest } from "../types/auth";

// controller register
export const register = async (c: Context) => {
  try {
    // ekstrak data yang sudah tervalidasi
    const { name, username, email, password } = c.get(
      "validatedBody",
    ) as RegisterRequest;

    // Cek duplikat email / username
    const existing = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        username: usersTable.username,
      })
      .from(usersTable)
      .where(
        or(
          eq(usersTable.email, email),
          eq(usersTable.username, username)
        )
      )
      .limit(1);

    const existingUser = existing[0];

    // Jika ada duplikat, kembalikan error 409 Conflict
    if (existingUser) {
      const conflictField =
        existingUser.email === email
          ? "email"
          : existingUser.username === username
            ? "username"
            : "email";
      return c.json(
        {
          success: false,
          message:
            conflictField === "email"
              ? "Email sudah terdaftar"
              : "Username sudah digunakan",
          errors: { [conflictField]: "Telah digunakan" },
        },
        409,
      );
    }

    // Hash password (Bun gunakan Argon2id secara default)
    const hashedPassword = await Bun.password.hash(password);

    // Buat user baru
    await db.insert(usersTable).values({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Ambil data user yang baru saja dibuat (jangan sertakan password)
    const newUserList = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        username: usersTable.username,
        email: usersTable.email,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    const user = newUserList[0];

    // return response sukses 201
    return c.json(
      {
        success: true,
        message: "User Berhasil Dibuat",
        data: user,
      },
      201,
    );
  } catch (err) {
    // return internal server error
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};
