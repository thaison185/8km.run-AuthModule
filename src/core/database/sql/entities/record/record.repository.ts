import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base/base.repository";
import { Repository } from "typeorm";
import { Record } from "./record.entity";

@Injectable()
export class RecordRepository extends BaseRepository<Record> {
	constructor(@InjectRepository(Record) repository: Repository<Record>) {
		super(repository);
	}
}
