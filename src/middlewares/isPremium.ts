import { Request, Response, NextFunction } from 'express';

const isPremium = async (request: Request, response: Response, next: NextFunction) => {
    try {
        if (request.User && request.User.role === 'PREMIUM') {
            next();
        } else {
            return response.status(403).json({ message: "Access denied. Premium members only." });
        }
    } catch (error: any) {
        next(error);
    }
}

export default isPremium;