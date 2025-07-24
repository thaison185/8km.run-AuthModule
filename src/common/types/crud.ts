import { DeepPartial, EntityManager, FindManyOptions, FindOptionsRelations } from "typeorm";
import { ID } from "./id";

export interface IBaseCRUD<T, TValue = ID> {
	create(body: DeepPartial<T>, manager?: EntityManager): Promise<T>;

	// isExist(id: TValue, manager?: EntityManager): Promise<boolean>;

	getById(
		id: TValue,
		relations: string[] | FindOptionsRelations<T>,
		manager?: EntityManager
	): Promise<T | null | undefined>;

	// getByKey<K extends keyof T>(
	// 	key: K,
	// 	value: string | TValue | boolean,
	// 	relations: string[] | FindOptionsRelations<T>,
	// 	manager?: EntityManager
	// ): Promise<T[]>;

	// count(where?: any, manager?: EntityManager): Promise<number>;

	list(
		limit: number,
		offset: number,
		options: Omit<FindManyOptions<T>, "take" | "skip" | "order">,
		order?: any,
		manager?: EntityManager
	): Promise<T[]>;

	listAll(where?: any, relations?: string[] | FindOptionsRelations<T>, manager?: EntityManager): Promise<T[]>;

	// updateById(
	// 	id: TValue,
	// 	doc: QueryDeepPartialEntity<Omit<T, "id" | "created">>,
	// 	manager?: EntityManager
	// ): Promise<T | UpdateResult | null | undefined>;

	// deleteById(id: TValue | TValue[], manager?: EntityManager): Promise<void>;
}
