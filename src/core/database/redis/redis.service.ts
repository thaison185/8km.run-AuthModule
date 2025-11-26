import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	private client: Redis;

	constructor(protected configService: ConfigService) {}

	async onModuleInit() {
		const redisUrl = this.configService.get<string>("REDIS_URL");

		if (!redisUrl) {
			throw new Error("REDIS_URL environment variable is not set");
		}

		this.client = new Redis(redisUrl, {
			retryStrategy: (times) => Math.min(times * 50, 2000),
			enableReadyCheck: false,
			maxRetriesPerRequest: null
		});

		this.client.on("error", (err) => {
			// eslint-disable-next-line no-console
			console.error("Redis connection error:", err);
		});
	}

	async onModuleDestroy() {
		await this.client.quit();
	}

	pipeline() {
		return this.client.pipeline();
	}

	async setHash(key: string, data: Record<string, string | number | boolean>): Promise<string> {
		return this.client.hmset(key, data);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async setValue(key: string, value: any, expirationSeconds?: number | string): Promise<void> {
		const data = JSON.stringify(value);
		if (expirationSeconds) {
			await this.client.setex(key, Number(expirationSeconds), data);
		} else {
			await this.client.set(key, data);
		}
	}

	async getValue<T>(key: string): Promise<T | null> {
		const result = await this.client.get(key);
		if (result) {
			return JSON.parse(result);
		}
		return null;
	}

	async getValues<T>(keys: string[]): Promise<(T | null)[]> {
		if (keys.length === 0) return [];
		const results = await this.client.mget(...keys);
		return results.map((result) => (result ? JSON.parse(result) : null));
	}

	async getKeys(pattern: string): Promise<string[]> {
		return this.client.keys(pattern);
	}

	async deleteValue(...keys: string[]): Promise<number> {
		if (keys.length === 0) return 0;
		return this.client.del(...keys);
	}

	async exists(key: string): Promise<boolean> {
		const result = await this.client.exists(key);
		return result > 0;
	}

	async expire(key: string, seconds: number): Promise<number> {
		return this.client.expire(key, seconds);
	}

	async ttl(key: string): Promise<number> {
		return this.client.ttl(key);
	}
}
