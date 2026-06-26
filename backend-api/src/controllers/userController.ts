// import type Context dari Hono
import type { Context } from "hono";

// import db and schema
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq, or, and, ne, desc } from "drizzle-orm";

// import type UserCreateRequest dan UserUpdaterequest
import type { UserCreateRequest, UserUpdaterequest } from "../types/user";

/**
 * @param c
 * @returns
 * get all users
 */
export const getUsers = async (c: Context) => {
  try {
    //get all users
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        username: usersTable.username,
        email: usersTable.email,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable)
      .orderBy(desc(usersTable.id));

    //return JSON
    return c.json(
      {
        success: true,
        message: "List Data Users",
        data: users,
      },
      200,
    );
  } catch (e: unknown) {
    console.error(`Error getting users: ${e}`);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};

/**
 * @param c
 * @returns
 * Create a new user
 */
export const createUser = async (c: Context) => {
  try {
    // ekstrak data yang sudah tervalidasi
    const { name, username, email, password } = c.get(
      "validatedBody",
    ) as UserCreateRequest;

    // Cek duplikat email / username
    const existing = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        username: usersTable.username,
      })
      .from(usersTable)
      .where(or(eq(usersTable.email, email), eq(usersTable.username, username)))
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

    // Ambil data user yang baru saja dibuat
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
  } catch (e: unknown) {
    console.error(`Error creating user: ${e}`);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};

/**
 * @param c
 * @returns
 * get user by ID
 */
export const getUserById = async (c: Context) => {
  try {
    //get userId from param
    const userId = c.req.param("id");

    //get user by ID
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        username: usersTable.username,
        email: usersTable.email,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, Number(userId)))
      .limit(1);

    const user = users[0];

    //if user not found
    if (!user) {
      return c.json(
        {
          success: false,
          message: "User Tidak Ditemukan!",
        },
        404,
      );
    }

    //return JSON
    return c.json(
      {
        success: true,
        message: "Detail Data User",
        data: user,
      },
      200,
    );
  } catch (e: unknown) {
    console.error(`Error getting user by ID: ${e}`);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};

/**
 * @param c
 * @returns
 * update user by ID
 */
export const updateUser = async (c: Context) => {
  try {
    //get userId from param
    const userId = c.req.param("id");

    //if user not found
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, Number(userId)))
      .limit(1);

    const user = users[0];
    if (!user) {
      return c.json(
        {
          success: false,
          message: "User Tidak Ditemukan!",
        },
        404,
      );
    }

    //ekstrak data yang sudah tervalidasi
    const { name, username, email, password } = c.get(
      "validatedBody",
    ) as UserUpdaterequest;

    //Cek duplikat email / username kecuali user itu sendiri
    const conditions = [];
    if (email) conditions.push(eq(usersTable.email, email));
    if (username) conditions.push(eq(usersTable.username, username));

    let existingUser = null;
    if (conditions.length > 0) {
      const existing = await db
        .select({
          id: usersTable.id,
          email: usersTable.email,
          username: usersTable.username,
        })
        .from(usersTable)
        .where(
          and(
            or(...conditions),
            ne(usersTable.id, Number(userId))
          )
        )
        .limit(1);

      existingUser = existing[0];
    }

    //Jika ada duplikat, kembalikan error 409 Conflict
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

    //update user by ID
    await db
      .update(usersTable)
      .set({
        name: name !== undefined ? name : user.name,
        username: username !== undefined ? username : user.username,
        email: email !== undefined ? email : user.email,
        password: password ? await Bun.password.hash(password) : user.password,
      })
      .where(eq(usersTable.id, Number(userId)));

    const updatedUserList = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        username: usersTable.username,
        email: usersTable.email,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, Number(userId)))
      .limit(1);

    const updatedUser = updatedUserList[0];

    //return JSON
    return c.json(
      {
        success: true,
        message: "User Berhasil Diupdate!",
        data: updatedUser,
      },
      200,
    );
  } catch (e: unknown) {
    console.error(`Error updating user by ID: ${e}`);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};

/**
 * @param c
 * @returns
 * delete user by ID
 */
export const deleteUser = async (c: Context) => {
  try {
    //get userId from param
    const userId = c.req.param("id");

    //if user not found
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, Number(userId)))
      .limit(1);

    const user = users[0];
    if (!user) {
      return c.json(
        {
          success: false,
          message: "User Tidak Ditemukan!",
        },
        404,
      );
    }

    //delete user by ID
    await db.delete(usersTable).where(eq(usersTable.id, Number(userId)));

    //return JSON
    return c.json(
      {
        success: true,
        message: "User Berhasil Dihapus!",
      },
      200,
    );
  } catch (e: unknown) {
    console.error(`Error deleting user by ID: ${e}`);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};
