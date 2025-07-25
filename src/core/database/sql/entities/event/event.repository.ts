import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base/base.repository";
import { Repository } from "typeorm";
import { Event } from "./event.entity";

@Injectable()
export class EventRepository extends BaseRepository<Event> {
	constructor(@InjectRepository(Event) repository: Repository<Event>) {
		super(repository);
	}
}
