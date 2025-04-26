import cron from 'node-cron'
import { prisma } from '../config/prismaConfig.js'
import { sendUserToMail } from './mailService.js';


export function schedulePaymentComplete() {

    cron.schedule('0 * * * *', async () => {
        try {
            const twentyFourOurgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            const completionPayment = await prisma.payment.findMany({
                where: {
                    Status: "PENDING",
                    PaymentDate: {
                        lte: twentyFourOurgo
                    }
                },
                include: {
                    booking: {
                        include: {
                            customer: true
                        }
                    }
                }


            });

            for (const payment of completionPayment) {

                await prisma.payment.update({
                    where: {
                        paymentID: payment.paymentID
                    },
                    data: {
                        Status: "COMPLETED"
                    }
                });

                if (payment.customer && payment.booking.customer.Email) {
                    await sendUserToMail(
                        payment.booking.customer.Email,
                        {
                            id: payment.paymentID,
                            amount: payment.Amount,
                            date: payment.PaymentDate
                        }
                    );
                }

            }



            console.log('Update payment for completed payment');
        } catch (error) {
            console.error('Error in payment Completion')
        }
    });

}