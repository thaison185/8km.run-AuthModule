import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshToken } from "src/core/database/sql/entities/refresh-token";
import { User } from "src/core/database/sql/entities/user";
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from "@nestjs/config";
import { JwtConfig } from "src/common/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    ConfigModule.forFeature(JwtConfig),
    JwtModule.registerAsync({
        imports: [ConfigModule.forFeature(JwtConfig)],
        inject: [JwtConfig.KEY],
        useFactory: (jwtConfig: ConfigType<typeof JwtConfig>) => ({
            secret: jwtConfig.accessSecret,
            signOptions: { expiresIn: `${jwtConfig.accessTokenTtl}s` },
        }),
    })
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
