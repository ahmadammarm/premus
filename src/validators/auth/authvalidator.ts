import { body } from "express-validator";

export const AuthValidator = {
    Signup: [
        body("email")
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Invalid email format")
            .normalizeEmail(),

        body("password")
            .notEmpty().withMessage("Password is required")
            .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
            .trim(),

        body("name")
            .notEmpty().withMessage("Name is required")
            .isLength({ min: 2 }).withMessage("Name must be at least 2 characters long")
            .trim(),
    ],

    Signin: [
        body("email")
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Invalid email format")
            .normalizeEmail(),

        body("password")
            .notEmpty().withMessage("Password is required")
            .trim(),
    ],
};
