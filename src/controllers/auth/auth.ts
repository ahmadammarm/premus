import { Request, Response } from "express";
import logger from "../../utils/logger";
import prisma from "../../utils/prisma";
import hashpassword from "../../utils/hashpassword";
import comparepassword from "../../utils/comparepassword";
import generatejwt from "../../utils/generatejwt";

const SignupController = async (request: Request, response: Response) => {
    try {
        const { email, name, password } = request.body;

        const isEmailExists = await prisma.user.findUnique({
            where: { email }
        });

        if (isEmailExists) {
            return response.status(400).json({ message: "Email already in use" });
        }

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

const SigninController = async (request: Request, response: Response) => {
    try {
        const { email, password } = request.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await comparepassword(password, user.password);

        if (!isPasswordValid) {
            return response.status(401).json({ message: "Invalid password" });
        }

        const token = generatejwt({ id: user.id, name: user.name ?? "", email: user.email });

        response.status(200).json({ message: "Signin successful", user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });

    } catch(error: any) {
        logger.error(`Error in SigninController: ${error.message}`);
        response.status(500).json({ message: "Internal Server Error" });
    }
}

export { SignupController, SigninController };