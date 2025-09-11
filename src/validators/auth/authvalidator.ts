import { check } from "express-validator";

export const SignupValidator = [
    check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format").normalizeEmail(),
    check("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
    check("name").notEmpty().withMessage("Name is required"),
];

export const SigninValidator = [
    check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format").normalizeEmail(),
    check("password").notEmpty().withMessage("Password is required"),
];