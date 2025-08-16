import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtConfig } from "src/common/config";
import { RefreshToken } from "src/core/database/sql/entities/refresh-token";
import { User } from "src/core/database/sql/entities/user";
import { FirebaseModule } from "../firebase";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([User, RefreshToken]),
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
	providers: [AuthService],
	controllers: [AuthController],
	exports: [AuthService]
})
export class AuthModule {}
