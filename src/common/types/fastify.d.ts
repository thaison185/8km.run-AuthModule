/* eslint-disable @typescript-eslint/no-explicit-any */
import "fastify";

declare module "fastify" {
	interface FastifyRequest {
		user?: any;
	}
}
