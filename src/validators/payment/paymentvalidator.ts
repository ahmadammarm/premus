import { check } from "express-validator";

const PaymentValidator = [
    check("amount").notEmpty().withMessage("Amount is required").isFloat({ gt: 0 }).withMessage("Amount must be a number greater than 0"),
    check("userId").notEmpty().withMessage("User ID is required").isUUID().withMessage("User ID must be a valid"),
]

export default PaymentValidator;