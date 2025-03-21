const nodemailer = require('nodemailer');

const mailPaySheet = async (retrieveSelectedProvider, pdfBytes) => {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use Gmail or another email service
        auth: {
            user: 'your-email@gmail.com', // Your email
            pass: 'your-email-password', // Your email password or app-specific password
        },
    });

    // Email options
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: provider.email, // Provider's email
        subject: 'Your Monthly Paysheet',
        text: 'Please find your monthly paysheet attached.',
        attachments: [
            {
                filename: 'paysheet.pdf',
                content: pdfBytes,
            },
        ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};
