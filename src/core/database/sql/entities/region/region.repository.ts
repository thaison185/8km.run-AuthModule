import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base/base.repository";
import { ID } from "src/common/types/id";
import { EntityManager, In, Repository } from "typeorm";
import { Region } from "./region.entity";

@Injectable()
export class RegionRepository extends BaseRepository<Region> {
	constructor(@InjectRepository(Region) repository: Repository<Region>) {
		super(repository);
	}

	async deleteById(id: ID | ID[], manager?: EntityManager): Promise<void> {
		if (Array.isArray(id)) {
			await this.getManager(manager).delete(this.repository.target, { id: In(id) });
		} else {
			await this.getManager(manager).delete(this.repository.target, { id });
		}
	}
}
