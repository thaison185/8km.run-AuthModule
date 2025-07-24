import { DeepPartial, EntityManager, FindManyOptions, FindOptionsRelations, Repository } from "typeorm";
import { IBaseCRUD, ID } from "../types";

export class BaseRepository<T, TValue = ID> implements IBaseCRUD<T, TValue> {
	constructor(protected readonly repository: Repository<T>) {}

	protected getManager(manager?: EntityManager): EntityManager {
		return manager || this.repository.manager;
	}

	create(body: DeepPartial<T>, manager?: EntityManager): Promise<T> {
		const entity = this.repository.create(body);
		return this.getManager(manager).save(entity);
	}

	save(entity: T, manager?: EntityManager) {
		return this.getManager(manager).save(entity);
	}

	getById(id: TValue, relations?: string[] | FindOptionsRelations<T>, manager?: EntityManager): Promise<T | null> {
		return this.getManager(manager).findOne(this.repository.target, {
			where: { id } as any,
			relations
		});
	}

	list(
		limit: number,
		offset: number,
		options?: Omit<FindManyOptions<T>, "take" | "skip" | "order">,
		order?: any,
		manager?: EntityManager
	): Promise<T[]> {
		return this.getManager(manager).find(this.repository.target, {
			...(options || {}),
			take: limit,
			skip: offset,
			order
		});
	}

	listAll(where?: any, relations?: string[] | FindOptionsRelations<T>, manager?: EntityManager): Promise<T[]> {
		return this.getManager(manager).find(this.repository.target, { where, relations });
	}
}
