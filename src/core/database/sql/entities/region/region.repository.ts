import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base/base.repository";
import { Repository } from "typeorm";
import { Region } from "./region.entity";

@Injectable()
export class RegionRepository extends BaseRepository<Region> {
	constructor(@InjectRepository(Region) repository: Repository<Region>) {
		super(repository);
	}
}
