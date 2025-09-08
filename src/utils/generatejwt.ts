import jwt from "jsonwebtoken";
import logger from "./logger";

const generatejwt = (user: { id: string; name: string; email: string }) => {
    try {
        const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
            expiresIn: "1d"
        });
        return token;
    } catch (error: any) {
        logger.error(`Error generating JWT: ${error.message}`);
        throw new Error(error || "Error generating JWT");
    }
}

export default generatejwt;