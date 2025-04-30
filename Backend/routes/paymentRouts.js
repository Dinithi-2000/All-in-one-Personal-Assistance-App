import express from 'express'
import { createPayment, retrievAllPayments, filterPaymentHistory, retriveServiceCategory, retrieveSelectedProvider, makeProviderSalary, retrieveBookingDetails } from '../models/payment.js';
import { sendUserToMail } from '../services/mailService.js';

const router = express.Router();

//create path to make paymet
router.post("/makePayment", (req, res, next) => {
    console.log("MakePayment route accessed");
    next();
}, createPayment)

//retriev all payments
router.get("/paymentHistory", retrievAllPayments);

//retriev date filteed Payments
router.get("/filteredHistory", filterPaymentHistory);

//retrive categories name
router.get("/", retriveServiceCategory);

//retriev provider
router.get("/category/provider/:categoryID", retrieveSelectedProvider);

//retrieve booking details
router.get("/bookingDetails/:providerId/:customerId", retrieveBookingDetails);

//provider salary calculation
router.post("/AdminDashBoard/providerSalary/", makeProviderSalary);
/*
router.get('/test-email', async (req, res) => {
    const mail = 'sdinithi7@gmail.com';
    const payment = {
        id: '12',
        amount: '4500'
    };

    try {
        await sendUserToMail(mail, payment);
        res.status(200).send('Test email sent!');
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).send('Failed to send test email.');
    }
});*/




export { router as paymentRoute }


