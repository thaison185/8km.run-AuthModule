import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtConfig } from "src/common/config";
import { RedisService } from "src/core/database/redis";
import { EmailOtp } from "src/core/database/sql/entities/email-otp";
import { RefreshToken } from "src/core/database/sql/entities/refresh-token";
import { Session } from "src/core/database/sql/entities/session";
import { User } from "src/core/database/sql/entities/user";
import { FirebaseModule } from "../firebase";
import { GoogleAuthService } from "../google";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { EmailOtpService, EmailService } from "./email-otp";

@Module({
	imports: [
		TypeOrmModule.forFeature([User, RefreshToken, EmailOtp, Session]),
		ConfigModule.forFeature(JwtConfig),
		FirebaseModule,
		JwtModule.registerAsync({
			imports: [ConfigModule.forFeature(JwtConfig)],
			inject: [JwtConfig.KEY],
			useFactory: (jwtConfig: ConfigType<typeof JwtConfig>) => ({
				secret: jwtConfig.accessSecret,
				signOptions: { expiresIn: `${jwtConfig.accessTokenTtl}s` }
			})
		})
	],
	providers: [AuthService, GoogleAuthService, EmailService, EmailOtpService, AuthGuard, RedisService],
	controllers: [AuthController],
	exports: [AuthService, GoogleAuthService, EmailOtpService]
})
export class AuthModule {}
