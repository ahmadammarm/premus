import { body } from "express-validator";

export const PaymentValidator = [
    body("amount")
        .notEmpty().withMessage("Amount is required")
        .isFloat({ gt: 0 }).withMessage("Amount must be a number greater than 0"),
    body("userId")
        .notEmpty().withMessage("User ID is required")
        .isUUID().withMessage("User ID must be a valid UUID"),
];