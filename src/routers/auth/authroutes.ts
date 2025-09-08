import { Router } from "express";
import SignupController from "../../controllers/auth/auth";

const authrouter = Router();

authrouter.post("/signup", SignupController);

export default authrouter;