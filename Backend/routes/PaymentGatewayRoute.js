import express from 'express';
import { initPayment } from '../models/paymentGateway.js'
import { handlePayhereNotification } from '../models/payment.js';


const router = express.Router();

router.post('/init-payment', initPayment);

//payment Notiy
router.post('/payment-notify', handlePayhereNotification);

export { router as PaymentGatewayRoute }