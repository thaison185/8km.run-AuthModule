import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base/base.repository";
import { Repository } from "typeorm";
import { Donation } from "./donation.entity";

@Injectable()
export class DonationRepository extends BaseRepository<Donation> {
	constructor(@InjectRepository(Donation) repository: Repository<Donation>) {
		super(repository);
	}
}
