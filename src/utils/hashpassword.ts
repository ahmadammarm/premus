import bcrypt from "bcrypt";
import logger from "./logger";

const hashpassword = async (password: string) => {
    try {
        const saltBcrypt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltBcrypt);
        return hashedPassword;
    } catch (error: any) {
        logger.error(`Error hashing password: ${error.message}`);
        throw new Error(error || "Error hashing password");
    }
}

export default hashpassword;