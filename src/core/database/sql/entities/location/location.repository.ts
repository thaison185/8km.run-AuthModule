import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base/base.repository";
import { ID } from "src/common/types";
import { EntityManager, FindOptionsWhere, In, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Location } from "./location.entity";

@Injectable()
export class LocationRepository extends BaseRepository<Location> {
	constructor(@InjectRepository(Location) repository: Repository<Location>) {
		super(repository);
	}

	async updateById(
		id: ID,
		doc: QueryDeepPartialEntity<Omit<Location, "id" | "created">>,
		manager?: EntityManager
	): Promise<Location | null> {
		const where: FindOptionsWhere<Location> = { id };
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
