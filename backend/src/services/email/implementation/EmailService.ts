import nodemailer ,{Transporter}from 'nodemailer'
import dotenv from 'dotenv'
import { IEmailService } from '../interface/IEmailService'

dotenv.config()

export class EmailService implements IEmailService {

    private transporter : Transporter
    private fromEmail :string

    constructor(){
        this.fromEmail = process.env.NODEMAILER_EMAIL as string

        this.transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.NODEMAILER_EMAIL,
        pass:process.env.NODEMAILER_PASSWORD   
            }
        })
    }

    async sendOtpEmail(email: string, otp: string): Promise<void> {
        const mailOptions = {
            from: this.fromEmail,
            to: email,
            subject: "LuxeBus - Email Verification OTP",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 10px;">
                
                <h2 style="color: #0B1F3A; text-align: center;">
                Welcome to LuxeBus
                </h2>

                <p>Hello,</p>

                <p>
                Thank you for choosing <strong>LuxeBus</strong>.
                Please use the following One-Time Password (OTP) to verify your email address.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                <h1 style="color: #C9A227; letter-spacing: 6px;">
                    ${otp}
                </h1>
                </div>

                <p>
                This OTP is valid for <strong>2 minutes</strong>.
                </p>

                <p>
                For your security, please do not share this OTP with anyone.
                </p>

                <p>
                If you did not request this verification, you can safely ignore this email.
                </p>

                <hr style="margin: 30px 0;">

                <p style="font-size: 14px; color: gray;">
                Regards,<br>
                <strong>LuxeBus Team</strong><br>
                Premium Bus Booking Platform
                </p>

            </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`OTP sent successfully to ${email}`);
        } catch (error) {
            console.log("Error while sending OTP email:", error);
            throw new Error("Failed to send OTP email");
        }
    }
}