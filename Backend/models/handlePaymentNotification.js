
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const handlePaymentNotification = async (req, res) => {
    // Extract payment details from the webhook payload
    const {
        order_id, // Unique identifier for the payment (e.g., booking ID)
        payment_id, // Payment gateway's transaction ID
        payhere_amount, // Amount paid
        payhere_currency, // Currency (e.g., LKR)
        status_code, // Payment status code (e.g., '2' for success)
        card_holder_name, // Cardholder's name
        card_no, // Masked card number
        customer_email, // Customer's email
    } = req.body;

    try {
        // Find the payment in the database using order_id
        const payment = await prisma.payment.findUnique({
            where: { BookingId: order_id },
        });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // Update payment status based on PayHere's response
        const updatedPayment = await prisma.payment.update({
            where: { BookingId: order_id },
            data: {
                Status: status_code === '2' ? 'COMPLETED' : 'FAILED', // PayHere status_code '2' means success
            },
        });

        console.log('Payment status updated:', updatedPayment);
        res.status(200).end(); // Respond to PayHere
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ error: 'Failed to update payment status' });
    }

}  
