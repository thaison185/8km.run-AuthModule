import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ZodValidationPipe } from "nestjs-zod";
import { MongooseConfigModule } from "./core/database/mongo";
import { dataSourceOptions } from "./core/database/sql";
import { AuthController } from "./mock/mock.controller";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		// RedisModule,
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async () => dataSourceOptions
		}),
		MongooseConfigModule
	],
	controllers: [AuthController],
	providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }]
})
export class AppModule {}
