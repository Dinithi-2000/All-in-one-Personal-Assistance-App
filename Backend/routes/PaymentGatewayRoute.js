import express from 'express';
import { initPayment } from '../models/paymentGateway.js'



const router = express.Router();

router.post('/init-payment', initPayment);



export { router as PaymentGatewayRoute }