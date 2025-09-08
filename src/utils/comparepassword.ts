import logger from "./logger"
import bcrypt from 'bcrypt';

const comparepassword = async (password: string, hashedpassword: string) => {
    try {
        const isMatchPassword = await bcrypt.compare(password, hashedpassword);
        return isMatchPassword;
    } catch(error: any) {
        logger.error(`Error in comparepassword: ${error.message}`);
        return false;
    }
}

export default comparepassword;