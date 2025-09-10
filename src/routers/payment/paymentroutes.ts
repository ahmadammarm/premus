import { Router } from "express";
import { PaymentNotificationController, PaymentController, GetPaymentStatusController } from "../../controllers/payment/payment";
import isAuthenticated from "../../middlewares/jwt";


const paymentrouter = Router();

paymentrouter.post('/create', isAuthenticated, PaymentController);
paymentrouter.post('/notification', PaymentNotificationController);

paymentrouter.get('/status/:orderId', isAuthenticated, GetPaymentStatusController);

export default paymentrouter;