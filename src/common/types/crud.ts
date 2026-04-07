import { DeepPartial, EntityManager, FindManyOptions, FindOptionsRelations } from "typeorm";
import { ID } from "./id";

export interface IBaseCRUD<T, TValue = ID> {
	create(body: DeepPartial<T>, manager?: EntityManager): Promise<T>;

	getById(
		id: TValue,
		relations: string[] | FindOptionsRelations<T>,
		manager?: EntityManager
	): Promise<T | null | undefined>;

	list(
		limit: number,
		offset: number,
		options: Omit<FindManyOptions<T>, "take" | "skip" | "order">,
		order?: Record<string, "ASC" | "DESC">,
		manager?: EntityManager
	): Promise<T[]>;

	listAll(where?: Partial<T>, relations?: string[] | FindOptionsRelations<T>, manager?: EntityManager): Promise<T[]>;
}
