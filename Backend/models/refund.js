import asyncHandler from "express-async-handler"
import { prisma } from "../config/prismaConfig.js"

//make payment forward to refund
const requestRefund = asyncHandler(async (req, res) => {
    try {
        const { userId, paymentId, reason } = req.body;

        if (!userId || !paymentId || !reason) {
            return res.status(400).json({ message: "Miising Required Fields" });
        }
        const refundPayment = await prisma.payment.findUnique({
            where: {
                paymentID: paymentId
            }

        });

        if (!refundPayment) {
            return res.status(404).json({ message: "Payment not found" });

        }

        //check is refund request successfull the refund conditions
        const payedDate = new Date(paymentId.paymentDate);
        const now = new Date();
        const dateDiffrenet = now - payedDate;

        if (refundPayment.status !== "PENDING" && dateDiffrenet > 24 * 60 * 60 * 1000) {
            return res.status(400).json({ message: "Refund not allowed after 24 hours" });
        }

        //create refund request
        const createRequest = await prisma.refundRequests.create({
            data: {

                customerID: userId,
                paymentId: paymentId,
                amount: parseFloat(refundPayment.Amount),
                reason: reason
            }
        });
        res.status(201).json({
            message: "Refund Request submitted successfully",
            createRequest
        });
    } catch (error) {
        console.error("Refund request failed:", error);
        res.status(500).json({ message: "Error processing refund request" });
    }
})

//retrieve all refund
const retrieveAllRefund = asyncHandler(async (req, res) => {

    try {
        const allRefund = await prisma.RefundRequests.findMany({
            orderBy: {
                requestAt: "desc"
            },
            include: {
                payment: true,
                customer: true,

            }
        });

        //map refund details 
        const refundDetails = allRefund.map(refund => ({
            ...refund,
            paymentDate: refund.payment.paymentDate,
            mail: refund.customer.email,
        }))
        res.send({ refund: refundDetails });
    } catch (error) {
        console.error("Error retrieving refund Details:", error);
        res.status(500).json({ message: "Error Retrieving Refund", error: error.message })
    }
})
export { requestRefund, retrieveAllRefund }