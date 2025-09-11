import { Router } from "express";
import { SigninController, SignupController } from "../../controllers/auth/auth";
import validateRequest from "../../middlewares/validateRequest";
import { SigninValidator, SignupValidator } from "../../validators/auth/authvalidator";

const authrouter = Router();

authrouter.post("/signup", SignupValidator, validateRequest, SignupController);
authrouter.post("/signin", SigninValidator, validateRequest, SigninController);

export default authrouter;