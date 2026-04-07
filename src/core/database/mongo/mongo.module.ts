import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { getMongooseConfig } from "./mongo.config";

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: () => getMongooseConfig()
		})
	],
	exports: [MongooseModule]
})
export class MongooseConfigModule {}
