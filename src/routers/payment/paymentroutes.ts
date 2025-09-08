import { Router } from "express";
import { PaymentCallbackController, PaymentController } from "../../controllers/payment/payment";
import isAuthenticated from "../../middlewares/jwt";


const paymentrouter = Router();

paymentrouter.post('/create-payment', isAuthenticated, PaymentController);
paymentrouter.post('/payment-notification', PaymentCallbackController);

export default paymentrouter;