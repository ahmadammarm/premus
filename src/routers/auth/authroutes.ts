import { Router } from "express";
import { SigninController, SignupController } from "../../controllers/auth/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidator } from "../../validators/auth/authvalidator";

const authrouter = Router();

authrouter.post("/signup", AuthValidator.Signup, validateRequest, SignupController);
authrouter.post("/signin", AuthValidator.Signin, validateRequest, SigninController);

export default authrouter;