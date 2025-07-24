import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base/base.repository";
import { ID } from "src/common/types";
import { EntityManager, FindOptionsRelations, FindOptionsWhere, In, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { User } from "./user.entity";

@Injectable()
export class UserRepository extends BaseRepository<User> {
	constructor(@InjectRepository(User) repository: Repository<User>) {
		super(repository);
	}

	isExist(id: ID, manager?: EntityManager): Promise<boolean> {
		const where: FindOptionsWhere<User> = { id };
		return this.getManager(manager).findOneBy(this.repository.target, where).then(Boolean);
	}

	getByKey<K extends keyof User>(
		key: K,
		value: User[K],
		relations?: string[] | FindOptionsRelations<User>,
		manager?: EntityManager
	): Promise<User[]> {
		const where: FindOptionsWhere<User> = { [key]: value } as any;
		return this.getManager(manager).find(this.repository.target, {
			where,
			relations
		});
	}

	async updateById(
		id: ID,
		doc: QueryDeepPartialEntity<Omit<User, "id" | "created">>,
		manager?: EntityManager
	): Promise<User | null> {
		const where: FindOptionsWhere<User> = { id };
		await this.getManager(manager).update(this.repository.target, where, doc);
		return this.getById(id, [], manager);
	}

	async deleteById(id: ID | ID[], manager?: EntityManager): Promise<void> {
		if (Array.isArray(id)) {
			await this.getManager(manager).delete(this.repository.target, { id: In(id) });
		} else {
			await this.getManager(manager).delete(this.repository.target, { id });
		}
	}
}
