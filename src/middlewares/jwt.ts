import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name?: string;
                email?: string;
            };
        }
    }
}

const isAuthenticated = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const authorization = request.headers.authorization
            ? request.headers.authorization.split(" ")
            : null;

        if (!authorization || authorization.length !== 2 || authorization[0] !== "Bearer") {
            response.status(401).json({
                code: 401,
                success: false,
                message: "Unauthorized: Invalid or missing authorization header",
            });
            return;
        }

        const token = authorization[1];
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            response.status(500).json({
                code: 500,
                success: false,
                message: "Server error: JWT secret is not configured",
            });
            return;
        }

        const payload = jwt.verify(token, jwtSecret) as JwtPayload;

        if (payload) {
            request.user = {
                id: payload.id as string,
                name: payload.name as string,
                email: payload.email as string,
            };
            next();
        } else {
            response.status(401).json({
                code: 401,
                success: false,
                message: "Unauthorized: Invalid token",
            });
        }
    } catch (error) {
        next(error);
    }
};

export default isAuthenticated;
