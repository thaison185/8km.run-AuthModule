/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { FastifyRequest } from "fastify";
import { JwtConfig } from "src/common/config";
import { IS_PUBLIC_KEY } from "src/common/decorators/public.decorator";
import { ClientErrors } from "src/common/error-messages";
import { IJwt } from "src/common/types";
import { SessionData } from "src/common/types/sessionData";
import { RedisService } from "src/core/database/redis";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly redisService: RedisService,
		private reflector: Reflector,
		@Inject(JwtConfig.KEY)
		private readonly jwtConfigService: ConfigType<typeof JwtConfig>
	) {}

	/**
	 * Check access token + session from Redis
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

		if (isPublic) return true;

		try {
			const request = context.switchToHttp().getRequest<FastifyRequest>();
			const token = this.extractTokenFromHeader(request);

			if (!token) {
				throw new UnauthorizedException(ClientErrors.Unauthorized.TokenNotFound);
			}

			// Verify access token
			const payload = await this.validateAccessToken(token);

			// Verify session from Redis
			const sessionKey = `user:${payload.id}:sess:${payload.session}`;
			const sessionData = await this.redisService.getValue<any>(sessionKey);

			if (!sessionData) {
				throw new UnauthorizedException(ClientErrors.Unauthorized.SessionNotFoundOrInvalid);
			}

			// Gán user vào request
			request.user = { ...payload, ...sessionData };
			return true;
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new UnauthorizedException(ClientErrors.Unauthorized.TokenExpired);
			}
			throw new UnauthorizedException(error || "Unauthorized");
		}
	}

	/**
	 * Extract Bearer token from header
	 */
	private extractTokenFromHeader(request: FastifyRequest): string | undefined {
		const authHeader = request.headers.authorization;
		const [type, token] = authHeader?.split(" ") ?? [];
		return type === "Bearer" ? token : undefined;
	}

	/**
	 * Verify access token
	 */
	async validateAccessToken(token: string): Promise<any> {
		return this.jwtService.verifyAsync(token, {
			secret: this.jwtConfigService.accessSecret
		});
	}

	/**
	 * Verify refresh token
	 */
	async validateRefreshToken(token: string): Promise<any> {
		return this.jwtService.verifyAsync(token, {
			secret: this.jwtConfigService.refreshSecret
		});
	}

	async createAccessToken(payload: IJwt): Promise<string> {
		return this.jwtService.signAsync(payload, {
			secret: this.jwtConfigService.accessSecret,
			expiresIn: this.jwtConfigService.accessTokenTtl
		});
	}

	async createRefreshToken(payload: IJwt, sessionData: SessionData, exp: number): Promise<string> {
		await this.redisService.setValue(`user:${payload.id}:sess:${payload.session}`, sessionData, exp);
		return this.jwtService.signAsync(payload, {
			secret: this.jwtConfigService.refreshSecret,
			expiresIn: this.jwtConfigService.refreshTokenTtl
		});
	}

	/**
	 * Destroy this session
	 */
	async destroySession(payload: IJwt): Promise<void> {
		await this.redisService.deleteValue(`user:${payload.id}:sess:${payload.session}`);
	}

	/**
	 * Destroy all user's sessions
	 */
	async destroyAllSessions(userId: string): Promise<string[]> {
		const keys = await this.redisService.getKeys(`user:${userId}:sess:*`);

		if (keys.length > 0) {
			await this.redisService.deleteValue(...keys);
		}

		const sessionIds = keys.map((key) => key.split(":").pop() || "");

		return sessionIds;
	}
}
