//import hono
import { Hono } from "hono";

//import middleware validateBody
import { validateBody } from "../middlewares/validate.middleware";

//import schema auth
import { registerSchema } from "../schemas/auth.schema";

//import controller register
import { register } from "../controllers/registerController";

//inistialize router
const router = new Hono();

//register route
router.post("/register", validateBody(registerSchema), register);

export const Routes = router;
