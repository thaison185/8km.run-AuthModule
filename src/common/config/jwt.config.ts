import { ConfigService, registerAs } from "@nestjs/config";

const configService = new ConfigService();

export const JwtConfig = registerAs("jwt", () => ({
	accessSecret: configService.get("ACCESS_TOKEN_SECRET") || "access-super-secret",
	refreshSecret: configService.get("REFRESH_TOKEN_SECRET") || "refresh-super-secret",

	accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL || "900", 10), // 15 minutes
	refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL || "86400", 10) // 24 hours
}));
