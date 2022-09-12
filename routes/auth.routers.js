import { Router } from "express";
import { SignIn, SignUp } from "../controllers/auth.controller.js";

const authRouter = Router();

// registro de usuário
authRouter.post('/sign-up', SignUp);
// login de usuário
authRouter.post("/sign-in", SignIn);

export default authRouter;