import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base/base.repository";
import { Repository } from "typeorm";
import { Location } from "./location.entity";

@Injectable()
export class LocationRepository extends BaseRepository<Location> {
	constructor(@InjectRepository(Location) repository: Repository<Location>) {
		super(repository);
	}
}
