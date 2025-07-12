import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import type { DataSourceOptions } from "typeorm";
import { DataSource } from "typeorm";
import type { SeederOptions } from "typeorm-extension";
import { entities } from "./entities";

config();

const configService = new ConfigService();
export const dataSourceOptions: DataSourceOptions & SeederOptions = {
	type: "postgres",
	host: configService.get<string>("POSTGRES_HOST"),
	port: configService.get<number>("POSTGRES_PORT", 5432),
	username: configService.get<string>("POSTGRES_USER"),
	password: configService.get<string>("POSTGRES_PASSWORD"),
	database: configService.get<string>("DB_NAME"),
	synchronize: false,
	entities,
	migrations: ["dist/src/core/database/sql/migrations/*.js"],
	seeds: ["dist/src/core/database/sql/seeders/**/*.js"],
	logging: false
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
