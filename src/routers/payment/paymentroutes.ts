import { Router } from "express";
import { PaymentNotificationController, PaymentController, GetPaymentStatusController } from "../../controllers/payment/payment";
import isAuthenticated from "../../middlewares/jwt";


const paymentrouter = Router();

paymentrouter.post('/payment', isAuthenticated, PaymentController);
paymentrouter.post('/payment/notification', PaymentNotificationController);

paymentrouter.get('/payment/status/:orderId', isAuthenticated, GetPaymentStatusController);

export default paymentrouter;