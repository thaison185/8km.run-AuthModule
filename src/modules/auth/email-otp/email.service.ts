import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
	private transporter;

	constructor(private configService: ConfigService) {
		this.transporter = nodemailer.createTransport({
			host: this.configService.get("SMTP_HOST"),
			port: this.configService.get("SMTP_PORT"),
			secure: false,
			auth: {
				user: this.configService.get("SMTP_USER"),
				pass: this.configService.get("SMTP_PASS")
			}
		});
	}

	async sendOtpEmail(email: string, otp: string): Promise<void> {
		const mailOptions = {
			from: this.configService.get("SMTP_FROM"),
			to: email,
			subject: "Your Login OTP Code",
			html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Login OTP</h2>
          <p>Your one-time password is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
		};

		await this.transporter.sendMail(mailOptions);
	}
}
