import { ConfigService } from "@nestjs/config";
import type { MongooseModuleOptions } from "@nestjs/mongoose";
import { config } from "dotenv";
import mongoose from "mongoose";

config();

const configService = new ConfigService();

export const getMongooseConfig = (): MongooseModuleOptions => {
	const mongoUrl = configService.get<string>("MONGO_URL");
	const dbName = configService.get<string>("MONGO_DB", "8kmrun");

	return {
		uri: mongoUrl,
		dbName,
		retryWrites: true,
		w: "majority",
		authSource: "admin",
		bufferCommands: false,
		maxPoolSize: 10,
		serverSelectionTimeoutMS: 5000,
		socketTimeoutMS: 45000
	};
};

export const createMongoConnection = async () => {
	const mongoConfig = getMongooseConfig();
	await mongoose.connect(mongoConfig.uri!, {
		dbName: mongoConfig.dbName,
		maxPoolSize: mongoConfig.maxPoolSize,
		serverSelectionTimeoutMS: mongoConfig.serverSelectionTimeoutMS,
		socketTimeoutMS: mongoConfig.socketTimeoutMS
	});
	// console.log("✅ MongoDB connected successfully!");
	return mongoose.connection;
};

// Export default connection
const MongoConnection = createMongoConnection();
export default MongoConnection;
