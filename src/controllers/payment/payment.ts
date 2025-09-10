import { Request, Response } from "express";
import logger from "../../utils/logger";
import snap from "../../utils/midtrans";
import prisma from "../../utils/prisma";
import crypto from "crypto";

const PaymentController = async (request: Request, response: Response) => {
    try {
        const { userId, amount } = request.body;
        if (!userId || !amount) {
            return response
                .status(400)
                .json({ message: "userId and amount are required" });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        if (user.role === "PREMIUM") {
            return response.status(400).json({ message: "User is already a premium member" });
        }


        const orderId = "order-" + Math.round(new Date().getTime() / 1000);

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: amount,
            },
            customer_details: {
                user_id: user.id,
                first_name: user.name,
                email: user.email,
            },
        };

        const transaction = await snap.createTransaction(parameter);

        const newTransaction = await prisma.transaction.create({
            data: {
                userId,
                amount,
                status: "PENDING",
                orderId,
                snapToken: transaction.token,
            },
        });

        return response.status(201).json({
            message: "Transaction created",
            transactionId: newTransaction.id,
            orderId,
            snapToken: transaction.token,
            redirectUrl: transaction.redirect_url,
        });
    } catch (error: any) {
        logger.error(error.message);
        return response.status(500).json({ message: error.message });
    }
};

const PaymentNotificationController = async (request: Request, response: Response) => {
    try {
        const { order_id, transaction_status, fraud_status, status_code, gross_amount } = request.body;

        if (!order_id || !transaction_status) {
            return response
                .status(400)
                .json({ message: "order_id and transaction_status are required" });
        }

        const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
        const signatureKey = request.headers["x-signature"] as string;

        if (signatureKey) {
            const expectedSignature = crypto
                .createHash("sha512")
                .update(order_id + gross_amount + status_code + serverKey)
                .digest("hex");

            if (signatureKey !== expectedSignature) {
                logger.warn(`Invalid signature: expected ${expectedSignature}, got ${signatureKey}`);
                return response.status(400).json({ message: "Invalid signature" });
            }
        }

        const transaction = await prisma.transaction.findUnique({
            where: { orderId: order_id },
            include: { User: true },
        });

        if (!transaction) {
            return response.status(404).json({ message: "Transaction not found" });
        }

        let newStatus = transaction.status;

        if (transaction_status === "settlement" || transaction_status === "capture") {
            if (fraud_status === "accept" || !fraud_status) {
                newStatus = "COMPLETED";

                if (transaction.User.role !== "PREMIUM") {
                    await prisma.user.update({
                        where: { id: transaction.userId },
                        data: { role: "PREMIUM" },
                    });
                    logger.info(`User ${transaction.userId} upgraded to PREMIUM`);
                };
            }
        } else if (transaction_status === "pending") {
            newStatus = "PENDING";
        } else {
            newStatus = "FAILED";
        }

        if (transaction.status === "COMPLETED") {
            return response.status(200).json({ message: "Transaction already completed", order_id, transaction_status });
        }

        await prisma.transaction.update({
            where: { orderId: order_id },
            data: {
                status: newStatus,
                updatedAt: new Date(),
            }
        });

        logger.info(`Transaction ${order_id} updated to status ${newStatus}`);

        return response
            .status(200)
            .json({ message: "Callback processed", order_id, transaction_status });
    } catch (error: any) {
        logger.error(error.message);
        return response.status(500).json({ message: error.message });
    }
};

const GetPaymentStatusController = async (request: Request, response: Response) => {
    try {
        const { orderId } = request.params;

        const userId = request.user?.id;

        const transaction = await prisma.transaction.findUnique({
            where: {
                orderId,
                userId
            }
        });

        if (!transaction) {
            return response.status(404).json({ message: "Transaction not found" });
        }

        return response.status(200).json({
            orderId: transaction.orderId,
            amount: transaction.amount,
            status: transaction.status,
            createdAt: transaction.createdAt,
        });

    } catch (error: any) {
        logger.error('');
        return response.status(500).json({ message: "Internal Server Error" })
    }
}

export { PaymentController, PaymentNotificationController, GetPaymentStatusController };
