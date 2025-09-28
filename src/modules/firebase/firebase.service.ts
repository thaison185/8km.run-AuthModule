// src/firebase/firebase.service.ts
import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import axios from "axios";
import { app } from "firebase-admin";

@Injectable()
export class FirebaseService {
	constructor(@Inject("FIREBASE_APP") private readonly firebaseApp: app.App) {}

	private readonly firebaseApiKey = process.env.FIREBASE_WEB_API_KEY;

	// private readonly recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;

	// private readonly recaptchaScoreThreshold = process.env.RECAPTCHA_SCORE_THRESHOLD;

	/**
	 * Send OTP function, Firebase REST API send OTP in backend
	 * No need if usingFirebase SDK in frontend to send OTP
	 */
	async sendOtp(phone: string, recaptchaToken: string): Promise<{ sessionInfo: string }> {
		try {
			const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=${this.firebaseApiKey}`;
			const res = await axios.post(url, {
				phoneNumber: phone,
				recaptchaToken
			});
			return { sessionInfo: res.data.sessionInfo };
		} catch (error) {
			throw new InternalServerErrorException({
				message: "Unexpected error while sending OTP!",
				error
			});
		}
	}

	/**
	 * For using OTP verify in backend
	 * Call Firebase REST API to verify OTP and get idToken
	 */
	async verifyOtp(sessionInfo: string, otp: string): Promise<{ phoneNumber: string; idToken: string }> {
		try {
			const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=${this.firebaseApiKey}`;
			const res = await axios.post(url, {
				code: otp,
				sessionInfo
			});
			return { phoneNumber: res.data.phoneNumber, idToken: res.data.idToken };
		} catch (error) {
			throw new InternalServerErrorException({
				message: "Unexpected error while verifying OTP!",
				error
			});
		}
	}

	/**
	 * Verify Firebase ID Token (JWT), return phone number
	 */
	async verifyIdToken(idToken: string): Promise<string> {
		try {
			const decodedToken = await this.firebaseApp.auth().verifyIdToken(idToken);
			if (!decodedToken.phone_number) {
				throw new UnauthorizedException("Phone number not found");
			}
			return decodedToken.phone_number;
		} catch (error) {
			throw new UnauthorizedException("Firebase ID verification failed");
		}
	}

	/**
	 * Verify reCaptcha token with Google
	 */
	// async validateRecaptcha(recaptchaToken: string): Promise<boolean> {
	// 	try {
	// 		const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
	// 			params: {
	// 				secret: this.recaptchaSecret,
	// 				response: recaptchaToken
	// 			}
	// 		});
	// 		return response.data.success && (response.data.score ?? 1) >= this.recaptchaScoreThreshold;
	// 	} catch {
	// 		return false;
	// 	}
	// }
}
