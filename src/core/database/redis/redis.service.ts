// import { Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { Redis } from "ioredis";

// @Injectable()
// export class RedisService {
// 	private client: Redis;

// 	constructor(protected configService: ConfigService) {
// 		const host = configService.get("REDIS_HOST");
// 		const port = +(configService.get("REDIS_PORT") || 6379);

// 		this.client = new Redis({ host, port, db: 0 });
// 	}

// 	pipeline = () => this.client.pipeline();

// 	async setHash(key: string, data: Record<string, string | number | boolean | Date>): Promise<string> {
// 		return this.client.hmset(key, data);
// 	}

// 	async setValue(key: string, value: any, expirationSeconds?: number | string): Promise<void> {
// 		const data = JSON.stringify(value);
// 		if (expirationSeconds) await this.client.setex(key, expirationSeconds, data);
// 		else await this.client.set(key, data);
// 	}

// 	async getValue<T>(key: string): Promise<T | null> {
// 		const result = await this.client.get(key);
// 		if (result) return JSON.parse(result);

// 		return null;
// 	}

// 	async getValues<T>(key: string): Promise<T[] | null> {
// 		const result = await this.client.mget(key);
// 		if (result) return result.map((obj) => JSON.parse(obj));
// 		return [];
// 	}

// 	async getKeys(key: string): Promise<string[]> {
// 		return this.client.keys(key);
// 	}

// 	async deleteValue(...keys: string[]): Promise<void> {
// 		await this.client.del(keys);
// 	}

// 	async exists(key: string): Promise<boolean> {
// 		return Boolean(await this.client.exists(key));
// 	}
// }
