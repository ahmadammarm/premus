import { Router } from "express";
import { PaymentNotificationController, PaymentController, GetPaymentStatusController } from "../../controllers/payment/payment";
import isAuthenticated from "../../middlewares/jwt";
import PaymentValidator from "../../validators/payment/paymentvalidator";
import validateRequest from "../../middlewares/validateRequest";


const paymentrouter = Router();

paymentrouter.post('/create', PaymentValidator, validateRequest, isAuthenticated, PaymentController);
paymentrouter.post('/notification', PaymentNotificationController);

paymentrouter.get('/status/:orderId', isAuthenticated, GetPaymentStatusController);

export default paymentrouter;