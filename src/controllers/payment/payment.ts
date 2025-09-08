import { Request, Response } from "express";
import logger from "../../utils/logger";
import snap from "../../utils/midtrans";
import prisma from "../../utils/prisma";

const PaymentController = async (request: Request, response: Response) => {
    try {
        const { userId, amount } = request.body;
        if (!userId || !amount) {
            return response
                .status(400)
                .json({ message: "userId and amount are required" });
        }

        const orderId = "order-" + Math.round(new Date().getTime() / 1000);

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: amount,
            },
            customer_details: {
                userId: userId,
            },
        };

        const transaction = await snap.createTransaction(parameter);

        const newTransaction = await prisma.transaction.create({
            data: {
                userId,
                amount,
                status: "PENDING",
                orderId,
            },
        });

        return response.status(201).json({
            message: "Transaction created",
            transactionId: newTransaction.id,
            orderId,
            redirectUrl: transaction.redirect_url,
        });
    } catch (error: any) {
        logger.error(error.message);
        return response.status(500).json({ message: error.message });
    }
};

const PaymentNotificationController = async ( request: Request, response: Response ) => {
    try {
        const { order_id, transaction_status, fraud_status } = request.body;

        if (!order_id || !transaction_status) {
            return response
                .status(400)
                .json({ message: "order_id and transaction_status are required" });
        }

        const transaction = await prisma.transaction.findUnique({
            where: { orderId: order_id },
        });

        if (!transaction) {
            return response.status(404).json({ message: "Transaction not found" });
        }

        let newStatus = transaction.status;

        if (transaction_status === "settlement" || transaction_status === "capture") {
            if (fraud_status === "accept" || !fraud_status) {
                newStatus = "COMPLETED";


                await prisma.user.update({
                    where: { id: transaction.userId },
                    data: { role: "PREMIUM" },
                });
            }
        } else if (transaction_status === "pending") {
            newStatus = "PENDING";
        } else {
            newStatus = "FAILED";
        }

        await prisma.transaction.update({
            where: { orderId: order_id },
            data: { status: newStatus },
        });

        return response
            .status(200)
            .json({ message: "Callback processed", order_id, transaction_status });
    } catch (error: any) {
        logger.error(error.message);
        return response.status(500).json({ message: error.message });
    }
};

export { PaymentController, PaymentNotificationController };
