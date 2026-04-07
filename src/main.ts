import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { initSwagger } from "./app.swagger";

async function bootstrap() {
	const fastifyAdapter = new FastifyAdapter();
	fastifyAdapter.getInstance().decorateRequest("user", null);

	const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter, {
		cors: { origin: true, credentials: true }
	});

	const configService = app.get(ConfigService);
	const port = configService.get("APP_PORT");
	const appName = configService.get("APP_NAME");

	initSwagger(app, appName);

	await app.listen(port, "0.0.0.0");
}
bootstrap();
