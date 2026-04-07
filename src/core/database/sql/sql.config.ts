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
	url: configService.get<string>("DATABASE_URL"),
	ssl: configService.get<boolean>("POSTGRES_SSL", false),
	synchronize: false,
	entities,
	migrations: ["dist/src/core/database/sql/migrations/*.js"],
	seeds: ["dist/src/core/database/sql/seeders/**/*.js"],
	logging: false
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
