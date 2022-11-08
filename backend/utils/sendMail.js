import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_MAIL, SMTP_PW } from '../config';

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        secure: true,
        auth: {
            user: SMTP_MAIL,
            pass: SMTP_PW,
        },
    });

    const matilOptions = {
        from: SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(matilOptions);
};

export default sendMail