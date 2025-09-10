export interface User {
    id: string;
    name?: string;
    email?: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            User?: User;
        }
    }
}