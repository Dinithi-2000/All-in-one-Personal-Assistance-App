import express from 'express'
import { requestRefund, retrieveAllRefund, requestApproved, RefundHistoryDelete } from '../models/refund.js';

const router = express.Router();

//create refund request
router.post("/requestRefund", (req, res, next) => {
    console.log("MakePayment route accessed");
    next()
}, requestRefund);

//retrieve refund details
router.get("/retrieveRefund", retrieveAllRefund);

//update Refund status
router.put("/Approval", requestApproved);

router.delete("/deleteRefund", RefundHistoryDelete)


export { router as RefundRouter }