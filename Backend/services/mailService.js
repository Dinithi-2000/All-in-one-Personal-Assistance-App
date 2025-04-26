import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNME,
        pass: process.env.EMAIL_PASSWORD,
    },
});


export async function sendUserToMail(useEmail, paymentDetails) {

    const mailOption = {
        from: process.env.EMAIL_USERNME,
        to: useEmail,
        subject: 'Your Payment Has Been Completed',
        html:
            `<h2>Payment Completed</h2>
        <p>Your payment of $${paymentDetails.amount} has been successfully processed</p>
        <p>Transaction Id : ${paymentDetails.id}</p>
        <p>Completion Date:${new Date().toLocaleString()}</p>`,

    };

    try {
        await transporter.sendMail(mailOption);
        console.log('Payment Completion email send to:', useEmail);

    } catch (error) {
        console.log("Error sending payment completition mail", error);
    }

}