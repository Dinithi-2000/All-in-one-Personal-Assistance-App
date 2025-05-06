// controllers/paymentController.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// PayHere Sandbox API Endpoint
const PAYHERE_CHECKOUT_URL = 'https://sandbox.payhere.lk/pay/checkout';

const initPayment = async (req, res) => {
    const { amount, currency, order_id, items } = req.body;

    const paymentData = {
        merchant_id: process.env.PAYHERE_MERCHANT_ID, // Replace with your PayHere Merchant ID
        return_url: 'http://your-frontend-url.com/payment-success', // Redirect after payment
        cancel_url: 'http://your-frontend-url.com/payment-cancel', // Redirect if payment is canceled
        notify_url: 'http://localhost:8070/api/payment-notify', // Webhook for payment notifications
        order_id: order_id,
        items: items,
        amount: amount,

    };

    try {
        // Redirect user to PayHere checkout page
        res.json({ checkout_url: `${PAYHERE_CHECKOUT_URL}?${new URLSearchParams(paymentData).toString()}` });
    } catch (error) {
        res.status(500).json({ error: 'Payment initialization failed' });
    }
};

export { initPayment };