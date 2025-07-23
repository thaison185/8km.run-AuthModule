import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base/base.repository";
import { Repository } from "typeorm";
import { LocationDetail } from "./locationDetail.entity";

@Injectable()
export class LocationDetailRepository extends BaseRepository<LocationDetail> {
	constructor(@InjectRepository(LocationDetail) repository: Repository<LocationDetail>) {
		super(repository);
	}
}
