import { DeepPartial, EntityManager, FindManyOptions, FindOptionsRelations, Repository } from "typeorm";
import { IBaseCRUD, ID } from "../types";

export class BaseRepository<T, TValue = ID> implements IBaseCRUD<T, TValue> {
	constructor(protected readonly repository: Repository<T>) {}

	create(body: DeepPartial<T>, manager?: EntityManager): Promise<T> {
		const entity = this.repository.create(body);
		return (manager || this.repository.manager).save(entity);
	}

	save(entity: T) {
		return this.repository.save(entity);
	}

	isExist(id: TValue, manager?: EntityManager): Promise<boolean> {
		return (manager || this.repository.manager).findOneBy(this.repository.target, { id } as any).then(Boolean);
	}

	getById(id: TValue, relations?: string[] | FindOptionsRelations<T>, manager?: EntityManager): Promise<T | null> {
		return (manager || this.repository.manager).findOne(this.repository.target, {
			where: { id } as any,
			relations
		});
	}

	getByKey<K extends keyof T>(
		key: K,
		value: string | TValue | boolean,
		relations?: string[] | FindOptionsRelations<T>,
		manager?: EntityManager
	): Promise<T[]> {
		return (manager || this.repository.manager).find(this.repository.target, {
			where: { [key]: value } as any,
			relations
		});
	}

	count(where?: any, manager?: EntityManager): Promise<number> {
		return (manager || this.repository.manager).count(this.repository.target, { where });
	}

	list(
		limit: number,
		offset: number,
		options?: Omit<FindManyOptions<T>, "take" | "skip" | "order">,
		order?: any,
		manager?: EntityManager
	): Promise<T[]> {
		return (manager || this.repository.manager).find(this.repository.target, {
			...(options || {}),
			take: limit,
			skip: offset,
			order
		});
	}

	listAll(where?: any, relations?: string[] | FindOptionsRelations<T>, manager?: EntityManager): Promise<T[]> {
		return (manager || this.repository.manager).find(this.repository.target, { where, relations });
	}

	async updateById(id: TValue, doc: Partial<Omit<T, "id" | "created">>, manager?: EntityManager): Promise<T | null> {
		// await (manager || this.repository.manager).update(this.repository.target, { id } as any, doc);
		return this.getById(id, [], manager);
	}

	async deleteById(id: TValue | TValue[], manager?: EntityManager): Promise<void> {
		await (manager || this.repository.manager).delete(this.repository.target, id);
	}
}
