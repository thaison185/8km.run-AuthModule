import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RequestContext = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return {
		ip: request.ip || request.socket.remoteAddress || "",
		userAgent: request.headers["user-agent"] || ""
	};
});
