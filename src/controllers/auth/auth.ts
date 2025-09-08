import { Request, Response } from "express";
import logger from "../../utils/logger";
import prisma from "../../utils/prisma";
import hashpassword from "../../utils/hashpassword";

const SignupController = async (request: Request, response: Response) => {
    try {
        const { email, name, password } = request.body;

        const hashedPassword = await hashpassword(password);
        
        if (!hashedPassword) {
            return response.status(500).json({ message: "Error hashing password" });
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: "BASIC"
            }
        });

        response.status(201).json({ message: "User created successfully", userId: newUser.id });

    } catch(error: any) {
        logger.error(`Error in SignupController: ${error.message}`);
        response.status(500).json({ message: "Internal Server Error" });
    }
}

export default SignupController;