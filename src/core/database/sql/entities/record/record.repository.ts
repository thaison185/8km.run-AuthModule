import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base/base.repository";
import { ID } from "src/common/types";
import { EntityManager, Repository } from "typeorm";
import { Record } from "./record.entity";

type RecordKey = { userId: ID; eventId: ID };

@Injectable()
export class RecordRepository extends BaseRepository<Record> {
	constructor(@InjectRepository(Record) repository: Repository<Record>) {
		super(repository);
	}

	async deleteById(key: RecordKey | RecordKey[], manager?: EntityManager): Promise<void> {
		await this.getManager(manager).delete(this.repository.target, key);
	}
}
