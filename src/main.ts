import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
		cors: { origin: true, credentials: true }
	});

	const configService = app.get(ConfigService);
	const port = configService.get("APP_PORT");
	const appName = configService.get("APP_NAME");

	patchNestJsSwagger();
	const config = new DocumentBuilder()
		.setTitle(`${appName} API`)
		.setDescription(`${appName} MASTER-API`)
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("/docs", app, document, { jsonDocumentUrl: "/docs/json" });

	await app.listen(port, "127.0.0.1");
}
bootstrap();
