import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { AuthController } from "./mock/mock.controller";

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true })],
	controllers: [AuthController],
	providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }]
})
export class AppModule {}
