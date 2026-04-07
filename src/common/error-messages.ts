export const ClientErrors = {
	BadRequest: {
		code: 400,
		RecaptchaValidationFailed: "RECAPTCHA_VALIDATION_FAILED",
		OtpRequestTooFrequent: "OTP_REQUEST_TOO_FREQUENT",
		SendOtpFailed: "SEND_OTP_FAILED"
	},
	NotFound: {
		code: 404,
		UserNotFound: "USER_NOT_FOUND"
	},
	Unauthorized: {
		code: 401,
		CredentialIncorrect: "CREDENTIALS_INCORRECT",
		UserAlreadyExist: "USER_ALREADY_EXISTS",
		RefreshTokenInvalid: "REFRESH_TOKEN_INVALID",
		PhoneMismatch: "PHONE_MISMATCH",
		PhoneNotRegistered: "PHONE_NOT_REGISTERED",
		OtpNotFound: "OTP_NOT_FOUND",
		OtpExpired: "OTP_EXPIRED",
		OtpInvalid: "OTP_INVALID",
		MaxOtpAttemptsExceeded: "MAX_OTP_ATTEMPTS_EXCEEDED",
		OtpVerificationFailed: "OTP_VERIFICATION_FAILED",
		FirebaseIdTokenInvalid: "FIREBASE_ID_TOKEN_INVALID",
		IdTokenNotFound: "ID_TOKEN_NOT_FOUND",
		AuthCodeExchangeFailed: "AUTH_CODE_EXCHANGE_FAILED",
		InvalidTokenPayload: "INVALID_TOKEN_PAYLOAD",
		TokenVerificationFailed: "TOKEN_VERIFICATION_FAILED",
		EmailNotVerified: "EMAIL_NOT_VERIFIED",
		GoogleIdMismatch: "GOOGLE_ID_MISMATCH",
		TokenNotFound: "TOKEN_NOT_FOUND",
		SessionNotFoundOrInvalid: "SESSION_NOT_FOUND_OR_INVALID",
		TokenExpired: "TOKEN_EXPIRED"
	},
	InternalServerError: {
		code: 500,
		SendOtpFailed: "SEND_OTP_FAILED",
		VerifyOtpFailed: "VERIFY_OTP_FAILED",
		GoogleLoginFailed: "GOOGLE_LOGIN_FAILED"
	}
};
