import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base/base.repository";
import { ID } from "src/common/types";
import { EntityManager, In, Repository } from "typeorm";
import { Record } from "./record.entity";

@Injectable()
export class RecordRepository extends BaseRepository<Record> {
	constructor(@InjectRepository(Record) repository: Repository<Record>) {
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
