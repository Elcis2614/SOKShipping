import nodemailer from 'nodemailer';
import { render } from "@react-email/render";
import GetFormated from '../dist/emails/email-formatter';

export const emailService = {
    async confirmOrder({ destination, subject, content }) {
        const data = await render(GetFormated({data:content}));
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: process.env.EMAIL_SERVER_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        const options = {
            from: `${process.env.EMAIL_TITLE} ${process.env.EMAIL_SERVER_USER}`,
            to: destination,
            subject,
            text: "Title of the order",
            html: data
        };
        transporter.sendMail(options, (error, info) => {
            if (error) {
                console.log("Mail error ", error);
            }
            else {
                console.log(" Email sent : ", info);
            }
        });

    }
}