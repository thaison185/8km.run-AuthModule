import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";
import { ClientErrors } from "./common/error-messages";

export const initSwagger = (app: INestApplication, appName: string) => {
	patchNestJsSwagger();
	const errorGroups = Object.entries(ClientErrors)
		.map(([groupName, { code, ...errors }]) => {
			const errorItems = Object.values(errors)
				.map((error) => `<li>${error}</li>`)
				.join("");
			return `<li><b>${code} - ${groupName}</b><ul>${errorItems}</ul></li>`;
		})
		.join("");

	const description = `<h3>The REST API documentation.</h3> <b>Available client errors:</b><ul>${errorGroups}</ul>`;

	const config = new DocumentBuilder()
		.setTitle(`${appName} API`)
		.addBearerAuth()
		.addServer(`/api`)
		.setDescription(description)
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("/docs", app, documentFactory, { jsonDocumentUrl: "/docs/json" });
};
