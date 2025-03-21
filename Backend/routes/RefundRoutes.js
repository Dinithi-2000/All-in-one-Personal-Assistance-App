import express from 'express'
import { requestRefund, retrieveAllRefund } from '../models/refund.js';

const router = express.Router();

//create refund request
router.post("/requestRefund", (req, res, next) => {
    console.log("MakePayment route accessed");
    next()
}, requestRefund);

//retrieve refund details
router.get("/retrieveRefund", retrieveAllRefund)

export { router as RefundRouter }