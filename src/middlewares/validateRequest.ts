import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

interface ValidationResultError {
    [key: string]: string[];
};

const validateRequest = (request: Request, response: Response, next: NextFunction) => {
    try {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            const validationErrors: ValidationResultError = errors.array().reduce(
                (acc, error) => {
                    if (error.type === "field") {
                        if (!acc[error.path]) {
                            acc[error.path] = [];
                        }
                        acc[error.path].push(error.msg as string);
                    }
                    return acc;
                },
                {} as ValidationResultError
            );

            return response.status(400).json({ errors: validationErrors });
        }
        return next();
    } catch (err: any) {
        console.error("Validation middleware error:", err.message);
        return response.status(500).json({ message: "Internal server error" });
    }
};

export default validateRequest;
