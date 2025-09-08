import { Router } from "express";
import { SigninController, SignupController } from "../../controllers/auth/auth";

const authrouter = Router();

authrouter.post("/signup", SignupController);
authrouter.post("/signin", SigninController);

export default authrouter;