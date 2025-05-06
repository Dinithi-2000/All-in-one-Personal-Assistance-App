import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.EMAIL_USERNME,
        pass: process.env.EMAIL_PASSWORD,
    },
});


export async function salaryMail(useEmail, paymentDetails) {

    const mailOption = {
        from: process.env.EMAIL_USERNME,
        to: useEmail,
        subject: 'Your Salary Has Been Completed',
        html:
            `<h2>Salary Completed</h2>
        <p>Your salary of $${paymentDetails} has been successfully processed</p>
        `

    };

    try {
        await transporter.sendMail(mailOption);
        console.log('Payment Completion email send to:', useEmail);

    } catch (error) {
        console.log("Error sending payment completition mail", error);
    }

}