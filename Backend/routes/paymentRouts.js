import express from 'express'
import { createPayment, retrievAllPayments, filterPaymentHistory, retriveServiceCategory, retrieveSelectedProvider, makeProviderSalary } from '../models/payment.js';

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

//provider salary calculation
router.post("/AdminDashBoard/providerSalary/", makeProviderSalary);

export { router as paymentRoute }


