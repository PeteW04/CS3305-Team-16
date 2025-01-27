import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "clack3306@gmail.com",
        pass: "wvno hiya hxld dhzi",
    },
});

export const sendEmail = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: `"Clack" clack3306@gmail.com`,
            to,
            subject,
            html: htmlContent,
        };

        const email = await transporter.sendMail(mailOptions);
        console.log('Email sent:', email.response);
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Failed to send email');
    }
};

