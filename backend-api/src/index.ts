import { Hono } from "hono";

//import routes
import { Routes } from "./routes";

// instansiasi Hono
const app = new Hono().basePath("/api");

// Use the imported routes
app.route("/", Routes);

export default app;
