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

        io.emit('new_Refund_Request'), {
            customerID: userId,
            paymentId: paymentId,
            amount: parseFloat(refundPayment.Amount),
            reason: reason,
            timeStamp: new Date().toISOString()
        }
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

//update refund status
const requestApproved = asyncHandler(async (req, res) => {
    try {

        const { refundID } = req.body;
        console.log("Accedd to approved");

        //find related refund details
        const requestDetails = await prisma.refundRequests.findUnique({
            where: {
                refundId: refundID
            }
        });

        //check refund status
        if (!requestDetails || requestDetails.status !== "PENDING") {
            return res._construct.status(400).json({ message: "Invalid or Alredy Refunded" });
        }

        //if refund found updtate payment and refund states
        const updatePayment = await prisma.payment.update({
            where: {
                paymentID: requestDetails.paymentId
            },
            data: {
                Status: "REFUNDED"
            }
        });

        //change refund status
        await prisma.refundRequests.update({
            where: {
                refundId: refundID

            },
            data: {
                status: "APPROVED"
            }
        });
        res.json({
            message: "Refund Approved SuccessFully",
            updatePayment
        })
    } catch (error) {
        console.error("Refunded Approval Error", error);
        res.status(500).json({ message: "Error occured when the processing refund" })
    }
})

const cancelRefund = asyncHandler(async (req, res) => {
    const { refundId } = req.body;

    const findrefund = await prisma.refundRequests.findUnique({
        where: {
            refundId: refundId
        }
    })

    if (findrefund.status !== "PENDING") {
        return res._construct.status(400).json({ message: "Invalid or Alredy Refunded" });
    }

    const updatePayment = await prisma.payment.update({
        where: {
            paymentID: findrefund.paymentId
        },
        data: {
            Status: "CANCELLED"
        }
    })

    await prisma.refundRequests.update({
        where: {
            refundId: refundId
        },
        data: {
            status: "CANCELLED"
        }
    })

    res.json({ message: "Request Canceled", updatePayment });


})

//delete refunded history
const RefundHistoryDelete = asyncHandler(async (req, res) => {
    const { refundIDs } = req.body;
    try {
        const deleteRefund = await prisma.refundRequests.deleteMany({
            where: {
                refundId: {
                    in: refundIDs//delete all the selected refunded id in array
                }
            }
        });
        res.status(200).json({ message: "Refund History delete Successfully", deleteRefund });
    } catch (error) {
        console.error("Error deleting refunds:", error);
        res.status(500).json({ message: "Error deleting refunds", error: error.message });
    }

});
export { requestRefund, retrieveAllRefund, requestApproved, RefundHistoryDelete, cancelRefund }